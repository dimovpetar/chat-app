import * as Sequelize from 'sequelize';
import * as dotenv from 'dotenv';

export class Database {
    public sequelize: Sequelize.Sequelize;

    constructor() {
        dotenv.load({path: '.env'});
        let db;
        const user = process.env.MYSQL_USER;
        const pwrd = process.env.MYSQL_PWRD;
        const host = process.env.MYSQL_HOST;
        if (process.env.NODE_ENV === 'dev') {
            db = process.env.MYSQL_TEST;
        } else {
            db =  process.env.MYSQL_PROD;
        }
    //    console.log(user, pwrd, host, db);
        this.sequelize = new Sequelize(db, user, pwrd, {
            host: host,
            dialect: 'mysql',
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        });

        this.sequelize.authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
        })
        .catch(err => {
          console.error('Unable to connect to the database:', err);
        });
    }

}

export default new Database();
// export class Database {
//     public connection: mysql.Connection;

//     setConfig(config) {
//         this.connection = mysql.createConnection(config);
//         console.log('mysql configured');
//         this.init();
//     }

//     init() {
//         console.log('mysql initialised');
//     }


//     query(sql, args = null) {
//         return new Promise((resolve, reject) => {
//             this.connection.query(sql, args, (err, rows) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(rows);
//             });
//         });
//     }

//     close() {
//         return new Promise( ( resolve, reject ) => {
//             this.connection.end(err => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve();
//             } );
//         } );
//     }
// }

// export default new Database();
