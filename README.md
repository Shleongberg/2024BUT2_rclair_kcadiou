# 2024BUT2_rclair_kcadiou
## Sommaire
- Présentation globale
- Extensions installées
- Problèmes renontrés
- Répartition du travail
- Note d'utilisation 

## Présentation

Le projet Locfit s'inscrit dans le cadre de la SAE3.01 et consiste à devellopée un site web de location de matériel sportif fonctionnel, avec différente fonctionnalité demandé. 

## Extensions installées :

- **Express**  
    Permet de créer facilement un serveur HTTP qui gère des routes (chemins d'URL).

- **Express-session**  
    Permet de créer des sessions, ainsi que stocker les données utilisateur.

- **md5**  
    Hash les mots de passe en MD5 pour un minimum de sécurité.

## Problèmes rencontrés :

* **Application du CSS sur certaines pages qui ne s'applique plus :**  <span style="color: orange; font-weight: bold;">Partiellement résolu</span>  
    - **Solution trouvée :** Appel du répertoire "public" pour faciliter le chargement du CSS et des images généralisées.  
    ![alt text](/public/image/image.png)

* **Authentification impossible :** <span style="color: green; font-weight: bold;">Résolu</span>  
    - **Solution trouvée :** Erreur de syntaxe dans la fonction `CheckLogin`.

* **Style page produit :**  <span style="color: red; font-weight: bold;">Non résolu</span>  
    - **Solution trouvée :** N/A

* **Création d'un produit :** <span style="color: red; font-weight: bold;">Non résolu</span>  
    - **Solution trouvée :** N/A

 * **Inscription impossible:** <span style="color: green; font-weight: bold;">Résolu</span>  
    - **Solution trouvée :** Erreur de déclaration de variable.

* **Retour sur la page profil :**  <span style="color: red; font-weight: bold;">Non résolu</span>  
    - **Solution trouvée :** N/A

* **Création d'un agent :** <span style="color: green; font-weight: bold;">Résolu</span>  
    - **Solution trouvée :** Mauvaise méthode utilisé pour le app, (utilisation de la méthode 'get' au lieu de 'post')
    ![alt text](/public/image/{30939868-49F5-4DD9-ADDF-87205030FE7A}.png)



## Répartition du travail :

**Kelvin :**
- Développement du Front
- Création de routes

**Raphaël :**
- Gestion de la base de données.
- Création des fonctionnalités :
    * Connexion / Inscription
    * Création d'agent
    * Modification des informations utilisateur

## Note d'utilisation :

Afin de revenir sur le profil, il faudra se ressaisir de son login et mot de passe.
