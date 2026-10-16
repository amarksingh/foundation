import Authenticatable = require('@ostro/auth/authenticatable');
import Model = require('@ostro/database/eloquent/model');
import Crypt = require('@ostro/support/facades/crypt');
import { implement } from '@ostro/support/function';

/**
 * Class User.
 */
class User extends (implement(Model, Authenticatable) as any) {

    /**
     * createToken method.
     * @returns Access token object
     */
    public async createToken(): Promise<{ accessToken: string }> {
        const token: string = Crypt.encrypt(this.getAttribute(this.getKeyName()) + Date.now());
        this.setApiToken(token);
        await this.save();
        return { accessToken: token };
    }
}

export = User;