export default {
  data() {
    return {
      email: {
        content: '',
        destinataire: '',
        subject: ''
      }
    }
  },
  methods: {
    displayVille(adresseFull) {
      if (adresseFull) {
        let ville = adresseFull.adr.split(',')
        return ville[ville.length - 3]
      } else {
        return null
      }
    },
    calculPrix(data) {
      let initialValue = 0
      if (data.length > 0) {
        let val = data.reduce(function (accumulator, currentValue) {
          let remise =
            typeof currentValue.remise === 'undefined'
              ? 0
              : currentValue.remise

          return (
            accumulator +
            (currentValue.prix - currentValue.prix * (remise / 100))
          )
        }, initialValue)
        return val
      } else return 0
    },
    prixcommande(commande, ht) {
      let total = 0
      commande.forEach(element => {
        total += this.prixSalon(element)
      })
      if (ht) return Number(total.toString())
      else return this.prixTTc(Number(total.toString()))
    },
    prixSalon(salon, taxe = false) {
      let total =
        this.calculPrix(salon.stand) +
        this.calculPrix(salon.option_salon) +
        this.calculPrix(salon.option_stand)
      if (taxe) return this.prixTTc(total)
      else return total
    },
    prixTTc(prix) {
      if (prix) { return Number(prix.toString()) * 0.2 + Number(prix.toString()) } else { return 0 }
    },
    testClairFonce: function (rgb) {
      // Like this : rgb(0, 0, 0);
      // If is this operation be <= 128 return white, others else return black
      let OpositeColor =
        0.3 * rgb.r + 0.59 * rgb.g + 0.11 * rgb.b <= 128
          ? '#FFFFFF'
          : '#000000'
      return OpositeColor
    }
  }
}
