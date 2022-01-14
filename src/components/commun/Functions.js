/* eslint-disable no-unused-expressions */
export default {
  data () {
    return {
      email: {
        content: '',
        destinataire: '',
        subject: ''
      }
    }
  },
  methods: {
    displayVille (adresseFull) {
      if (adresseFull) {
        let ville = adresseFull.adr.split(',')
        return ville[ville.length - 3]
      } else {
        return null
      }
    },
    calculPrix (data) {
      let initialValue = 0
      if (data.length > 0) {
        let val = data.reduce(function (accumulator, currentValue) {
          let remise =
            typeof currentValue.remise === 'undefined' ? 0 : currentValue.remise

          return (
            accumulator +
            (currentValue.prix - currentValue.prix * (remise / 100))
          )
        }, initialValue)
        return val
      } else return 0
    },
    prixcommande (commande, ht) {
      let total = 0
      commande.forEach((element) => {
        total += this.prixSalon(element)
      })
      if (ht) return Number(total.toString())
      else return this.prixTTc(Number(total.toString()))
    },
    prixSalon (salon, taxe = false) {
      let total =
        this.calculPrix(salon.stand) +
        this.calculPrix(salon.option_salon) +
        this.calculPrix(salon.option_stand)
      if (taxe) return this.prixTTc(total)
      else return total
    },
    prixTTc (prix) {
      if (prix) {
        return Number(prix.toString()) * 0.2 + Number(prix.toString())
      } else {
        return 0
      }
    },
    testClairFonce: function (rgb) {
      // Like this : rgb(0, 0, 0);
      // If is this operation be <= 128 return white, others else return black
      let OpositeColor =
        0.3 * rgb.r + 0.59 * rgb.g + 0.11 * rgb.b <= 128 ? '#FFFFFF' : '#000000'
      return OpositeColor
    },
    scaleImage: function (
      srcwidth,
      srcheight,
      targetwidth,
      targetheight,
      fLetterBox
    ) {
      var result = { width: 0, height: 0, fScaleToTargetWidth: true }

      if (
        srcwidth <= 0 ||
        srcheight <= 0 ||
        targetwidth <= 0 ||
        targetheight <= 0
      ) {
        return result
      }

      // scale to the target width
      var scaleX1 = targetwidth
      var scaleY1 = (srcheight * targetwidth) / srcwidth

      // scale to the target height
      var scaleX2 = (srcwidth * targetheight) / srcheight
      var scaleY2 = targetheight

      // now figure out which one we should use
      var fScaleOnWidth = scaleX2 > targetwidth
      if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox
      } else {
        fScaleOnWidth = !fLetterBox
      }

      if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1)
        result.height = Math.floor(scaleY1)
        result.fScaleToTargetWidth = true
      } else {
        result.width = Math.floor(scaleX2)
        result.height = Math.floor(scaleY2)
        result.fScaleToTargetWidth = false
      }
      result.targetleft = Math.floor((targetwidth - result.width) / 2)
      result.targettop = Math.floor((targetheight - result.height) / 2)

      return result
    },
    resizeImage: function (file) {
      let self = this
      return new Promise(function (resolve, reject) {
        try {
          const img = new Image()
          img.src = file.file
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            var result = self.scaleImage(
              img.width,
              img.height,
              file.width,
              file.height,
              true
            )
            ctx.drawImage(img, 0, 0, result.width, result.height)
            var resizeImg = canvas.toDataURL('image/jpeg')
            resolve({ data: resizeImg, type: 'jpeg' })
          }
          // When there's an error during load, reject the promise
          img.addEventListener('error', function imgOnError (error) {
            console.log(error)
          })
        } catch (error) {
          console.log('Error while image resize: ', error)
          reject(error)
        }
      })
    }
  }
}
