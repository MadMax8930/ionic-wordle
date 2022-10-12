# ionic-wordle

Dans Wordle, le joueur doit deviner un mot de 5 lettres à travers différentes tentatives en lui donnant des indications sur la présence ou non d'une lettre dans le mot ainsi que son bon placement ou non, le tout en 6 essais.

​

Un joueur peut :

Se créer un compte
Se connecter à son compte
Lancer une nouvelle partie (une fois connecté)
Jouer au jeu (une fois connecté)
Accéder à la liste des 200 mots possibles (une fois connecté)

​

Prototype fonctionnel du jeu sur mobile (Android)

Appli avec BDD PostgreSQL déploiyée sur Heroku

API de tous les mots: https://wordle-simplon.herokuapp.com/api/word

Authentification par token

s'enregistrer:
POST - https://wordle-simplon.herokuapp.com/api/auth/register

se connecter:
POST - https://wordle-simplon.herokuapp.com/api/auth/login



