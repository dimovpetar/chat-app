import { STRING, INTEGER, UUID, UUIDV4} from 'sequelize';
import db from '../db';
import fs from 'fs-extra';
import { IUser } from '../../shared/interfaces/user';
import app from '../app';

export const User = db.sequelize.define('user', {
    id: {
        type: UUID, primaryKey: true, defaultValue: UUIDV4
    },
    username: {
        type: STRING, allowNull: false, unique: true
    },
    email: {
        type: STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: STRING, allowNull: false
    },
    profilePicture: {
        type: STRING, defaultValue: 'assets/images/user/profileDefault.jpg'
    }
}, {
    hooks: {
        beforeDestroy: (user: IUser, options) => {
            if (user.profilePicture !== 'assets/images/user/profileDefault.jpg') {
                fs.unlink(app.get('publicDir') + '/' + user.profilePicture, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('successfully deleted', user.profilePicture);
                    }
                });
            }
        }
    }
});

User.sync()
    .then(() => console.log('User table synced'))
    .catch((err) => console.log(err));
