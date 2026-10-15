require('@ostro/support/helpers');
const Mix = require('../mix');
const ProviderRepository = require('../providerRepository');
const MixException = require('@ostro/support/exceptions/mixException');
const fs = require('fs');
const path = require('path');

describe('Mix and ProviderRepository', () => {
    test('Mix handles paths, manifests, and missing files', () => {
        const tmpPublic = path.join(__dirname, 'tmp_public');
        fs.mkdirSync(tmpPublic, { recursive: true });
        const manifestPath = path.join(tmpPublic, 'mix-manifest.json');
        fs.writeFileSync(manifestPath, JSON.stringify({
            '/js/app.js': '/js/app.js?id=123',
            '/css/app.css': '/css/app.css?id=456'
        }));

        global.public_path = (p) => path.join(tmpPublic, p);

        const appMock = {
            instance: jest.fn().mockReturnValue({
                get: (k) => {
                    if (k === 'app.debug') return true;
                    if (k === 'app.mix_url') return 'https://cdn.example.com';
                    return null;
                }
            }),
            logger: { report: jest.fn() },
            config: {
                get: (k) => (k === 'app.mix_url' ? 'https://cdn.example.com' : null)
            }
        };

        const mix = new Mix(appMock);

        // Path resolving with slash and without slash
        expect(mix.path('js/app.js')).toBe('https://cdn.example.com/js/app.js?id=123');
        expect(mix.path('/css/app.css')).toBe('https://cdn.example.com/css/app.css?id=456');

        // Missing manifest exception
        const nonExistentDir = path.join(__dirname, 'non_existent_dir');
        global.public_path = (p) => path.join(nonExistentDir, p);
        expect(() => mix.path('/js/missing.js')).toThrow(MixException);

        // File exists but is directory -> throw
        const fakeFileDir = path.join(tmpPublic, 'dir-manifest');
        fs.mkdirSync(fakeFileDir, { recursive: true });
        global.public_path = () => fakeFileDir;
        expect(() => mix.path('/js/app.js')).toThrow(MixException);

        // Missing file in manifest in debug mode -> throw
        global.public_path = (p) => path.join(tmpPublic, p);
        const mix2 = new Mix(appMock);
        expect(() => mix2.path('/js/unlisted.js')).toThrow(MixException);

        // Missing file in manifest when debug=false -> report to logger and return path
        appMock.instance.mockReturnValue({
            get: (k) => (k === 'app.debug' ? false : null)
        });
        const result = mix2.path('/js/unlisted.js');
        expect(result).toBe('/js/unlisted.js');
        expect(appMock.logger.report).toHaveBeenCalled();

        // Manifest directory with slash and without slash
        const subManifestDir = path.join(tmpPublic, 'build');
        fs.mkdirSync(subManifestDir, { recursive: true });
        fs.writeFileSync(path.join(subManifestDir, 'mix-manifest.json'), JSON.stringify({
            '/app.js': '/app.js?v=2'
        }));
        global.public_path = (p) => path.join(tmpPublic, p);
        expect(mix2.path('/app.js', 'build')).toBe('https://cdn.example.com/build/app.js?v=2');
        expect(mix2.path('/app.js', '/build')).toBe('https://cdn.example.com/build/app.js?v=2');

        // Without mix_url
        appMock.config.get = () => null;
        expect(mix2.path('/app.js', 'build')).toBe('/build/app.js?v=2');

        // Cleanup
        fs.rmSync(tmpPublic, { recursive: true, force: true });
    });

    test('ProviderRepository loads eager and deferred providers', () => {
        class EagerProvider {
            constructor(app) { this.app = app; }
            isDeferred() { return false; }
        }
        class DeferredProvider {
            constructor(app) { this.app = app; }
            isDeferred() { return true; }
        }

        const registered = [];
        const deferredServices = [];
        const appMock = {
            register: (p) => registered.push(p),
            addDeferredServices: (s) => deferredServices.push(...s)
        };

        const repo = new ProviderRepository(appMock, {});
        repo.load([EagerProvider, DeferredProvider]);

        expect(registered).toEqual([EagerProvider]);
        expect(deferredServices).toEqual([DeferredProvider]);
        repo.loadManifest();
    });
});
