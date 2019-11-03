$(function () {
  var morphApiUrl = 'https://api.morph.io/markbrough/exchangerates-scraper/data.json'
  var morphApiKey = 'wFTSIH61nwMjLBhphd4T'

  var project = new Vue({

    el: '#project',

    data: {
      currencies: [['USD', 'US Dollar'], ['AUD', 'Australian Dollar'], ['BRL', 'Brazilian Real'], ['CAD', 'Canadian Dollar'], ['CHF', 'Swiss Franc'], ['CLP', 'Chilean Peso'], ['CNY', 'Yuan Renminbi'], ['COP', 'Colombian Peso'], ['CRC', 'Costa Rican Colon'], ['CZK', 'Czech Koruna'], ['DKK', 'Danish Krone'], ['EUR', 'Euro'], ['GBP', 'Pound Sterling'], ['HKD', 'Hong Kong Dollar'], ['HUF', 'Forint'], ['IDR', 'Rupiah'], ['ILS', 'New Israeli Sheqel'], ['INR', 'Indian Rupee'], ['ISK', 'Iceland Krona'], ['JPY', 'Yen'], ['KRW', 'Won'], ['LKR', 'Sri Lanka Rupee'], ['LVL', 'Latvian Lats'], ['MXN', 'Mexican Peso'], ['MYR', 'Malaysian Ringgit'], ['NOK', 'Norwegian Krone'], ['NZD', 'New Zealand Dollar'], ['PLN', 'Zloty'], ['RUB', 'Russian Ruble'], ['SEK', 'Swedish Krona'], ['SGD', 'Singapore Dollar'], ['THB', 'Baht'], ['TRY', 'Turkish Lira'], ['TWD', 'New Taiwan Dollar'], ['VEF', 'Bolivar'], ['XDR', 'International Monetary Fund (IMF) Special Drawing Right (SDR)'], ['ZAR', 'Rand']],
      amountFrom: '1000000',
      currencyFrom: 'GBP',
      amountTo: '',
      currencyTo: 'USD',
      date: '1991-11-01',
      fromRate: '',
      fromRateDate: '',
      toRate: '',
      toRateDate: '',
      rate: ''
    },

    created: function () {
      this.update()
    },

    watch: {
      amountFrom: 'update',
      currencyFrom: 'update',
      currencyTo: 'update',
      date: 'update'
    },

    filters: {
      commify: (v) => {
        return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      },
      round: (v) => {
        return (Math.round(v * 100) / 100).toFixed(2)
      }
    },

    methods: {
      getRate: function (currency, date) {
        if (currency === 'USD') {
          return new Promise((resolve, reject) => {
            resolve([
              [{Rate: 1, Date: date}],
              'success'
            ])
          })
        }
        var query = 'SELECT * FROM `rates` WHERE `Currency` = "' + currency + '" ORDER BY ABS( strftime( "%s", `Date` ) - strftime( "%s", "' + date + '" ) ) ASC LIMIT 1'

        console.log(query)

        return $.ajax({
          url: morphApiUrl,
          dataType: 'jsonp',
          data: {
            key: morphApiKey,
            query: query
          }
        })
      },
      update: function () {
        var self = this
        self.rate = ''
        self.amountTo = ''

        if (!self.currencyFrom || !self.currencyTo || !self.date || !self.amountFrom) {
          return
        }

        var fromRate = self.getRate(self.currencyFrom, self.date)
        var toRate = self.getRate(self.currencyTo, self.date)

        $.when(fromRate, toRate).done((fromRate, toRate) => {
          self.fromRate = 1 / parseFloat(fromRate[0][0].Rate)
          self.fromRateDate = fromRate[0][0].Date
          self.toRate = parseFloat(toRate[0][0].Rate)
          self.toRateDate = toRate[0][0].Date
          self.rate = self.toRate * self.fromRate
          self.amountTo = self.amountFrom * self.rate
        })
      }
    }
  })
})
