<template>
  <div class="container">
    <div v-for="(doc, key) in documents" :key="key" class="card">
      <div class="card-header">
        <div class="card-header__btn">
          <span @click="toggleVisible(key)">{{ visible.indexOf(key) > -1 ? '▲' : '▼' }}</span>
        </div>
        <div class="card-header__date">{{ doc.date }}</div>
        <div class="card-header__docs">Документов: {{ doc.docs.length }} ({{ floatToPrice(doc.total) }}₽)</div>
      </div>
      <div class="card-body" v-show="visible.indexOf(key) > -1">
        <div v-for="(item, iKey) in doc.docs" :key="iKey" class="card-body__item">
          <div class="card-body__item__header">
            <div class="card-body__item__header__status">{{ item.status }} №{{ item.id }}</div>
            <div class="card-body__item__header__total">{{ floatToPrice(item.total) }}₽</div>
          </div>
          <div class="card-body__item__body">
            <div class="card-body__item__body__header">
              <span @click="toggleVisible(`${key}-${iKey}`)">{{ visible.indexOf(`${key}-${iKey}`) > -1 ? '▲' : '▼' }}</span>
              Товаров: {{ item.products.length }}
            </div>
            <div class="card-body__item__body__body" v-show="visible.indexOf(`${key}-${iKey}`) > -1">
              <div v-for="(product, pKey) in item.products" :key="pKey" class="card-product">
                <div class="card-product__img" :style="{ backgroundImage: `url('${product.image}')` }"></div>
                <div class="card-product__name">{{ product.name }}</div>
                <div class="card-product__status">{{ product.quantity }} штук x {{ floatToPrice(product.price) }}₽</div>
                <div class="card-product__price">{{ floatToPrice(product.quantity * product.price) }}₽</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import records from './records.json'

  moment.locale('ru')

  export default {
    data () {
      return {
        visible: [],
        records
      }
    },

    computed: {
      /**
       * Отсортированные записи по возрастанию даты
       *
       * @return {Array}
       */
      recordsSort () {
        return this.records.slice(0).sort((a, b) => {
          if (new Date(a.date) < new Date(b.date)) {
            return -1
          }
          if (new Date(a.date) > new Date(b.date)) {
            return 1
          }
          return 0
        })
      },

      /**
       * Отсортировать записи по возрастанию даты
       *
       * @return {Array}
       */
      documents () {
        const docs = {}

        for (const record of this.recordsSort) {
          const date = moment(record.date)
          const key = date.format('YYYY-MM-DD') // строку из объекты преобразовываю в ключ key

          if (docs[key] === undefined) {
            docs[key] = {
              date: date.format('DD MMMM'),
              total: 0,
              docs: []
            }
          }

          let doc = docs[key].docs
            .find(({ id }) => {
              return record.id === id
            })

          if (!doc) {
            doc = {
              id: record.id,
              status: record.name1,
              products: [],
              total: 0
            }
            docs[key].docs.push(doc)
          }

          const product = {
            name: record.name2,
            image: record.image,
            price: parseFloat(record.price),
            quantity: parseInt(record.quantity)
          }
          doc.products.push(product)

          doc.total += product.price * product.quantity
          docs[key].total += product.price * product.quantity
        }
        const output = []

        for (const key of Object.keys(docs)) {
          output.push(docs[key])
        }

        return output
      }
    },

    methods: {
      /**
       * Метод преобразования формата числа с плавающей точкой к формату цены
       *
       * @param num
       * @return {string}
       */
      floatToPrice (num) {
        return num
          /* Оставить только два числа после точки (пример: 10522.5609 к 10522.56) */
          .toFixed(2)
          /* Преобразовать число к строке */
          .toString()
          /* Добавить пробелы в числе между тысячными (пример: 10522.56 к 10 522.56)  */
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          /* Заменить точку на запятую (пример: 10 522.56 к 10 522,56) */
          .replace(/\./g, ',')
      },

      /**
       * Метод сворачивания/разворачивания карточек
       *
       * @param key
       */
      toggleVisible (key) {
        /* Найти по ключу развернутую карточку */
        const i = this.visible.indexOf(key)

        /* Если карточка нашлась, тогда свернуть её, если нет, тогда развернуть */
        if (i > -1) {
          this.visible.splice(i, 1)
        } else {
          this.visible.push(key)
        }
      }
    }
  }
</script>

<style>
  body {
    background-color: ghostwhite;
  }
  .container {
    width: 400px;
    margin: 0 auto;
  }
  .card {
    background-color: white;
    border: 1px solid #bbbbbb;
    margin-top: 10px;
    -webkit-box-shadow: 0px 14px 34px -14px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 14px 34px -14px rgba(0,0,0,0.75);
    box-shadow: 0px 14px 34px -14px rgba(0,0,0,0.75);
    color: grey;
  }
  .card-header,
  .card-body__item__header {
    display: flex;
  }
  .card-header__btn, .card-header__date, .card-header__docs,
  .card-body__item__header__status, .card-body__item__header__total {
    flex: auto;
  }
  .card-header__btn {
    text-align: center;
  }
  .card-header__docs {
    text-align: right;
  }
  .card-header__date {
    text-transform: capitalize;
  }
  .card-body__item {
    padding: 10px 40px;
    border-bottom: 1px solid #bebebe;
  }
  .card-body__item:last-child {
    border-bottom: none;
  }
  .card-body__item__body {
    padding: 10px 0;
  }
  .card-product__img {
    width: 40px;
    height: 40px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>
