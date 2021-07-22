export const messages = [
  {
    code: 'ADMIN',
    message: 'FATAL ERROR : [PARAM]',
    type: 'error'
  },
  { code: 'SAOK', message: 'sauvegarde effectuée', type: 'success' },
  { code: 'SAKO', message: 'sauvegarde impossible', type: 'error' },
  { code: 'SUOK', message: 'Suppression effectuée', type: 'success' },
  { code: 'SUKO', message: 'Suppression impossible', type: 'error' },
  { code: 'IMOK', message: "Chargement de l'image effectuée", type: 'success' },
  { code: 'IMKO', message: "Chargement de l'image en erreur", type: 'error' },
  { code: 'IDKO', message: "Affichage de l'image impossible", type: 'error' },
  {
    code: 'NDAT',
    message: 'Aucune données en base',
    type: 'warning'
  },
  { code: 'UAKO', message: "impossible d'ajouter un profil ", type: 'error' },
  {
    code: 'LUKO',
    message: 'impossible de lire le profil utilisateur ',
    type: 'error'
  },

  // message sur plan
  {
    code: 'DLOJ',
    message: 'Impossible de dupliquer les objets',
    type: 'error'
  },
  { code: 'SSNS', message: 'Pas de salons à afficher', type: 'warning' },
  { code: 'DCNX', message: 'Vous êtes déconnecté', type: 'primary' },
  {
    code: 'ECNX',
    message: 'Impossible de procéder à la déconnexion',
    type: 'error'
  },
  { code: 'CNXU', message: 'Vous êtes maintenant connecté', type: 'success' },
  { code: 'ERRA', message: 'Erreur applicatif', type: 'error' },
  { code: 'LOAS', message: 'pas de stand pour ce salon', type: 'warning' },
  { code: 'ASKO', message: 'creation stand impossible', type: 'error' },
  { code: 'USKO', message: 'Mise à jour du stand impossible', type: 'error' },
  { code: 'USOK', message: 'Stand sauvegardé', type: 'success' },
  { code: 'SLIS', message: 'Impossible de charger le détail', type: 'error' },
  { code: 'SLIN', message: 'Vous devez sélectionner un stand', type: 'info' },
  { code: 'DOBJ', message: "Impossible de supprimer l'object", type: 'error' },
  { code: 'FSTE', message: 'Impossible de charger un onglet', type: 'error' },
  { code: 'FSID', message: "Impossible de lire l'id salon", type: 'error' },
  { code: 'OSEM', message: "pas d'option sur ce salon", type: 'warning' },
  { code: 'OSEL', message: 'erreur lecture option salon', type: 'error' },
  { code: 'DBST', message: 'impossible de récupérer le stand', type: 'error' },
  { code: 'CMND', message: 'pas de commande en cours', type: 'warning' },
  { code: 'RECE', message: 'recherche reservation en erreur', type: 'error' },
  { code: 'ACKO', message: 'adresse mail client inconnu', type: 'error' },
  {
    code: 'LCER',
    message: 'récupération des commerciaux impossible',
    type: 'error'
  },
  { code: 'TYUK', message: 'Type utilisateur inconnu', type: 'error' },
  { code: 'ERUE', message: 'Maj email user impossible', type: 'error' },
  { code: 'ERRE', message: 'lecture email user impossible', type: 'error' },
  {
    code: 'PACM',
    message: 'Votre commande a été prise en compte, merci',
    type: 'succes'
  },
  {
    code: 'EGIM',
    message: 'Impossible de récuperer la banque emplacement',
    type: 'error'
  },
  { code: 'LIMG', message: 'Impossible de charger une image', type: 'error' },
  {
    code: 'LEVT',
    message: 'Impossible de charger vos évènements',
    type: 'error'
  },
  {
    code: 'EVAD',
    message: "Impossible de retrouver l'adresse du plan",
    type: 'warning'
  },
  {
    code: 'EVLP',
    message: 'Impossible de retrouver la liste des plans',
    type: 'error'
  },
  {
    code: 'EADC',
    message: 'le nom, la catégorie et la programmation sont obligatoire',
    type: 'error'
  },
  {
    code: 'SRKO',
    message: 'Impossible de sauvegarder la réservation',
    type: 'error'
  },
  {
    code: 'SCKO',
    message: 'Impossible de sauvegarder la commande',
    type: 'error'
  },
  {
    code: 'RPKO',
    message: 'Impossible de récupérer le profil client',
    type: 'error'
  },
  { code: 'CMUU', message: 'utilisateur inconnu', type: 'error' },
  {
    code: 'REKO',
    message: "impossible d'affciher les réservation",
    type: 'error'
  },
  { code: 'REDR', message: 'Le stand est déjà réservé', type: 'warning' },
  {
    code: 'CADD',
    message: 'vos données ont été ajoutées au panier',
    type: 'success'
  },
  {
    code: 'OSDE',
    message: "Suppression de l'option impossible",
    type: 'error'
  },
  { code: 'CCOK', message: 'Votre commande a été envoyée', type: 'succes' },
  {
    code: 'CCKO',
    message:
      "Impossible d'enregistrer votre commande, contacter l'administrateur",
    type: 'error'
  },
  { code: 'MSPR', message: 'La proposition a été envoyée', type: 'success' },
  {
    code: 'EMKO',
    message: 'adresse mail du destinataire inconnu',
    type: 'error'
  },
  { code: 'MSKO', message: "Impossible d'envoyer le message", type: 'error' },
  {
    code: 'FSGD',
    message: 'Impossible de récupérer les données',
    type: 'error'
  },
  {
    code: 'CDAN',
    message: 'vous confirmez votre annulation ?',
    type: 'warning'
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
    code: 'QDUS',
    message: 'voulez-vous supprimer cet utilisateur',
    type: 'question'
  }
]
