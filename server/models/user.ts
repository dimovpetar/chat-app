import { STRING, INTEGER, UUID, UUIDV4} from 'sequelize';
import db from '../db';

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
        type: STRING, defaultValue: 'assets/images/user/profileDefault'
    }
});

User.sync()
    .then(() => console.log('User table synced'))
    .catch((err) => console.log(err));
