export const messages = [
  {
    code: 'ADMIN',
    message: 'FATAL ERROR : [PARAM]',
    type: 'error'
  },
  { code: 'SAOK', message: 'sauvegarde effectuée', type: 'success' },
  { code: 'SAKO', message: 'sauvegarde impossible :[PARAM]', type: 'error' },
  { code: 'SUOK', message: 'Suppression effectuée', type: 'success' },
  { code: 'SUKO', message: 'Suppression impossible', type: 'error' },
  { code: 'IMOK', message: "Chargement de l'image effectuée", type: 'success' },
  { code: 'IMKO', message: "Chargement de l'image en erreur", type: 'error' },
  { code: 'IDKO', message: "Affichage de l'image impossible", type: 'error' },
  {
    code: 'CNAA',
    message: "Affichage de l'avatar impossible [PARAM]",
    type: 'warning'
  },
  {
    code: 'NDAT',
    message: 'Aucune données en base',
    type: 'warning'
  },

  // gestion du plan
  {
    code: 'SLIN',
    message: 'vous devez sélectionner un objet',
    type: 'success'
  },
  // message connexion
  {
    code: 'DLOJ',
    message: 'Impossible de dupliquer les objets',
    type: 'error'
  },
  { code: 'DCNX', message: 'Vous êtes déconnecté', type: 'primary' },
  {
    code: 'EDNX',
    message: 'Impossible de procéder à la déconnexion',
    type: 'error'
  },
  {
    code: 'ECNX',
    message: 'Impossible de vous connecter :[PARAM]',
    type: 'error'
  },
  {
    code: 'CNXU',
    message: 'Vous êtes maintenant connecté',
    type: 'success'
  },
  {
    code: 'CEEM',
    message: 'création impossible, cet email est déjà attribué',
    type: 'error'
  },
  {
    code: 'CEPR',
    message: 'création impossible : [PARAM]',
    type: 'error'
  },
  {
    code: 'CGPR',
    message: 'Impossible de récupérer votre profil',
    type: 'error'
  },

  { code: 'LIMG', message: 'Impossible de charger une image', type: 'error' },
  {
    code: 'LEVT',
    message: 'Impossible de charger vos évènements: [PARAM]',
    type: 'error'
  },
  {
    code: 'EVAD',
    message: "Impossible de retrouver l'adresse du plan",
    type: 'warning'
  },
  {
    code: 'EADC',
    message: 'le nom, la catégorie et la programmation sont obligatoire',
    type: 'error'
  },
  {
    code: 'IMDE',
    message: 'le format des dates est incorrect [PARAM]',
    type: 'error'
  },
  /*
      QUESTIONS
  */
  {
    code: 'GMOD',
    message: 'Voulez-vous savegarder vos modifications  ?',
    type: 'question'
  },
  {
    code: 'QSOS',
    message: 'voulez-vous supprimer cette option',
    type: 'question'
  },
  {
    code: 'QADR',
    message: 'voulez-vous sauvegarder la valeur [PARAM]',
    type: 'question'
  }
]
