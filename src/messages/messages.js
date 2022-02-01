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

  // message connexion

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
    code: 'CEPR',
    message: 'création impossible : [PARAM]',
    type: 'error'
  },
  {
    code: 'MEPR',
    message: 'modification impossible : [PARAM]',
    type: 'error'
  },
  {
    code: 'CGPR',
    message: 'Impossible de récupérer votre profil',
    type: 'error'
  },
  {
    code: 'CNEM',
    message: 'votre email [PARAM] à été modifié',
    type: 'success'
  },
  {
    code: 'CNPW',
    message: 'votre mot de passe a été changé, veuillez vous reconnecter',
    type: 'success'
  },

  { code: 'LIMG', message: 'Impossible de charger une image', type: 'error' },
  {
    code: 'LEVT',
    message: 'Impossible de charger vos évènements: [PARAM]',
    type: 'error'
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
  {
    code: 'DTER',
    message: 'date/heure de fin trop petite ',
    type: 'error'
  },
  {
    code: 'AACT',
    message: 'votre alerte est active',
    type: 'success'
  },
  {
    code: 'ADIS',
    message: 'votre alerte est désactivée',
    type: 'success'
  },
  /*
      QUESTIONS
  */
  {
    code: 'QMOD',
    message: 'Voulez-vous sauvegarder vos modifications  ?'
  },
  {
    code: 'QSOS',
    message: 'voulez-vous supprimer cette option'
  },
  {
    code: 'QADR',
    message: 'voulez-vous sauvegarder la valeur [PARAM]'
  }
]
