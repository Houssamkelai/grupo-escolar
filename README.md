# Grupo Escolar España — visite patrimoniale 3D

Site statique autonome : extérieurs, cour, façades, pavillon central et toitures du Collège Imam Malik à Larache. Le modèle provient exclusivement de `GRUPO_ESCOLAR_V2.blend`. Aucun intérieur n'est ajouté.

## Publication GitHub Pages

1. Créer un repository GitHub.
2. Déposer **le contenu de ce dossier à la racine du repository**, avec `index.html`, `.nojekyll` et les sous-dossiers. Ne pas déposer seulement le dossier parent ou l'archive ZIP.
3. Dans **Settings → Pages**, choisir **Deploy from a branch**, puis **main / (root)** et enregistrer.
4. Ouvrir l'adresse publiée par GitHub après la fin du déploiement.

Les ressources sont locales au site, leurs chemins sont relatifs. Three.js et ses utilitaires sont inclus : pas de CDN, de compilation, de clé API ni d'installation côté hébergement. Le site fonctionne aussi dans un sous-répertoire. La procédure suit la [documentation officielle GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Utilisation

- Visite guidée : onze étapes, pause, précédent/suivant et sélection d'une étape.
- Exploration libre : rotation, zoom, déplacement et raccourcis vers la cour, la façade nord, l'ensemble et la toiture.
- Souris : glisser pour tourner, molette pour zoomer, bouton droit pour déplacer la vue.
- Tactile : un doigt pour tourner, deux doigts pour zoomer et déplacer la vue.
- Déplacement : boutons fléchés ; touches WASD / ZQSD lorsque la vue 3D a le focus.
- Points d'intérêt : titre, description et photographie lorsque disponible.
- Interface et descriptions en français, arabe avec lecture droite à gauche, et espagnol.

Pour un aperçu avant publication, servir le dossier avec un serveur HTTP statique. Une ouverture directe du fichier HTML depuis le disque ne permet pas aux navigateurs de charger normalement les modules et les fichiers JSON.

## Modèle et optimisation

Le GLB pèse **18 902 484 octets**, soit **18,03 Mio**. Il conserve **297 323 triangles** et utilise **12 lots de matériaux**, avec **5 petites textures intégrées**. Aucun fichier ne dépasse 25 Mo. Le site complet pèse **20,69 Mio**. Le poids total exact du dossier est indiqué dans `data/site-metrics.json`.

La conversion évalue les modificateurs et instances de la V2, triangule les surfaces et regroupe les géométries par matériau. Elle ne reconstruit ni ne décime l'architecture. Les objets techniques masqués, les découpes booléennes, les références photographiques et les caméras de travail ne sont pas exportés comme architecture.

Le modèle source n'utilise pas de textures photographiques pour les matériaux. Les couleurs PBR, la rugosité et la métallisation sont reprises. La patine procédurale est approximée par des textures répétables intégrées ; le microrelief des shaders Blender n'est pas intégralement reproduit. Le relief géométrique des tuiles, grilles et moulures est conservé. Détails de conversion et empreinte du fichier source : `data/model-info.json`.

La V2 est reproduite telle quelle. Le calage architectural de sa façade nord demeurait une hypothèse de travail : ce site ne constitue pas une validation métrique ou historique de cette géométrie.

## Déplacements et collisions

`data/collisions.json` contient des prismes convexes issus des volumes du modèle. Ils bloquent les bâtiments entiers, même derrière une baie ouverte, afin d'éviter une fausse visite intérieure. Un contrôle du segment parcouru empêche de sauter un obstacle en zoomant rapidement. Les transitions guidées montent d'abord au-dessus des obstacles, se déplacent, puis redescendent à une position contrôlée. L'accès visuel à la cour se fait au-dessus de la clôture, sans inventer un portail.

## Mise à jour du modèle

1. Exporter la nouvelle version extérieure évaluée vers `models/grupo_escolar_web.glb`, sans écraser le fichier Blender source.
2. Conserver le repère web : mètres, axe Y vertical, origine au centre du site ; orientation locale de l'implantation redressée uniquement pour le repère de navigation. Le bâtiment lui-même conserve ses angles.
3. Si l'emprise, les hauteurs ou le repère changent, régénérer `data/collisions.json` et revoir les positions dans `data/tour.json`, `data/hotspots.json` et `data/config.json`.
4. Vérifier les matériaux, les onze trajets, les collisions, les points d'intérêt et les trois formats d'écran avant publication. Mettre à jour les poids et la provenance.

Le script de conversion utilisé est livré séparément dans les outils du projet de travail ; il n'est pas nécessaire au fonctionnement du site publié.

## Extension intérieure future

`data/config.json` expose `modeInterior: false` et `interior.enabled: false`. `data/tour.json` contient un tableau `interiorSteps` vide. Aucun couloir, classe, bibliothèque, grande salle, escalier ou mobilier intérieur n'est créé. Activer un intérieur demande un véritable modèle, un réseau de circulation, ses collisions et un parcours vérifié. Changer seulement le booléen ne suffit pas : cette version refuse une activation non implémentée.

Le dossier `audio/` est réservé aux futures narrations. Aucun audio n'est chargé actuellement.

## Sources et dépendances

- Architecture : fichier V2 fourni dans le projet, dont l'empreinte SHA-256 figure dans le rapport d'export.
- Photographies : documents fournis dans le projet.
- Aucune date de construction ou attribution d'architecte non vérifiée n'est présentée.
- Three.js **0.180.0**, licence MIT incluse dans `js/vendor/LICENSE.three.txt`. Imports adaptés pour un chargement local. [Documentation Three.js](https://threejs.org/docs/).

Le site ne collecte aucune donnée, ne comporte aucun outil d'analyse et ne dépend d'aucun service tiers à l'exécution.

## Vérifications de livraison

Le site a été chargé depuis un sous-répertoire HTTP, avec le véritable GLB, dans Microsoft Edge : ordinateur 1440 × 900, tablette 820 × 1180 et smartphone 390 × 844. Les deux derniers formats sont des émulations tactiles de navigateur, pas des mesures de performance sur appareils physiques.

Les contrôles ont vérifié les onze étapes, les trajectoires échantillonnées, le blocage devant le pavillon, les points d'intérêt, les trois langues et les panneaux. Résultat : aucune erreur JavaScript, HTTP, CORS ou de chargement du modèle, aucune ressource demandée hors du sous-répertoire et aucun débordement horizontal. Rapport : `data/validation.json`. Le rendu reste dépendant des capacités WebGL du matériel.
