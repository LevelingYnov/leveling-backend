'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate() {
            // Ajouter des associations ici si nécessaire
        }
    }
    Users.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: 'L\'adresse email doit �tre valide.' },
                notNull: { msg: 'L\'email est obligatoire.' }
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le nom d\'utilisateur est obligatoire.' }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Le mot de passe est obligatoire.' },
                len: { args: [8, 128], msg: 'Le mot de passe doit contenir entre 8 et 128 caract�res.' }
            }
        },
        registration_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        avatar: DataTypes.STRING,
        poids: DataTypes.INTEGER,
        taille: DataTypes.INTEGER,
        experience: {
            type: DataTypes.STRING,
            validate: {
                isIn: { args: [['BEGINNER', 'INTERMEDIATE', 'EXPERT']], msg: 'L\'exp�rience doit �tre BEGINNER, INTERMEDIATE ou EXPERT.' }
            }
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        abonnement: {
            type: DataTypes.STRING,
            defaultValue: 'FREE',
            validate: {
                isIn: { args: [['FREE', 'PREMIUM']], msg: 'L\'abonnement doit �tre FREE ou PREMIUM.' }
            }
        },
        role: {
            type: DataTypes.ENUM('User', 'Admin', 'SuperAdmin'),
            allowNull: false,
            defaultValue: 'User',
            validate: {
                isIn: { args: [['User', 'Admin', 'SuperAdmin']], msg: 'Le r�le doit �tre User, Admin ou SuperAdmin.' }
            }
        }
    }, {
        sequelize,
        modelName: 'Users',
        tableName: 'users',
        hooks: {
            beforeCreate: async (user) => {
                // Normalize the email
                user.email = normalizeEmail(user.email);

                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
                if (user.changed('username')) {
                    const existingUser = await User.findOne({ where: { username: user.username } });
                    if (existingUser) {
                        throw new Error("Ce nom d'utilisateur est déjà utilisé");
                    }
                }
                if (user.changed('email')) {
                    const existingEmail = await User.findOne({ where: { email: user.email } });
                    if (existingEmail) {
                        throw new Error("L'adresse email est déjà utilisé");
                    }
                }
            },
        }
    });
    // Function to normalize Gmail addresses
    function normalizeEmail(email) {
        const [localPart, domainPart] = email.split('@');
        if (domainPart.toLowerCase() === 'gmail.com') {
            return localPart.replace(/\./g, '') + '@' + domainPart;
        }
        return email;
    }
    return Users;
};
