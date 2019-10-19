<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        fappointment
      </h1>
      <h2 class="subtitle">
        My marvelous Nuxt.js project
      </h2>
      <div class="links">
        <datepicker
          id="dob"
          v-model="value"
          inputClass="form-control"
          placeholder="Select a date"
          name="datepicker"
          language="en"
        />
      </div>
      <div v-if="value && isWeekend" class="m-2 alert alert-warning" role="alert">
        Must select working days
      </div>

      <table v-if="value && !isWeekend" class="table table-striped mt-2">
        <thead>
          <tr>
            <th scope="col">
              Hour
            </th>
            <th scope="col">
              Name
            </th>
            <th scope="col">
              Email
            </th>
            <th>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 10" :key="i">
            <th scope="row">
              {{ i + 8 }}:00
            </th>
            <template v-if="appointments[i + 8]">
              <td class="pointer" @click="showModal(i)">{{ appointments[i + 8].name }}</td>
              <td class="pointer" @click="showModal(i)">{{ appointments[i + 8].email }}</td>
              <td>
                <button type="button" class="btn btn-outline-danger" @click="remove(i + 8)">Remove</button>
              </td>

            </template>
            <td class="pointer" v-else colspan="3" @click="showModal(i)" />
          </tr>
        </tbody>
      </table>

      <modal-add-appointment
        id="modal-1"
        :date="value"
        :hour="hour"
        :appointment="appointmentsSelected"
        @submitted="loadDay"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Datepicker from '~/components/TouchDatePicker.vue'
import ModalAddAppointment from '~/components/ModalAddAppointment.vue'
import Logo from '~/components/Logo.vue'
const api = process.env.NODE_ENV === 'production' ? 'https://evening-fortress-57965.herokuapp.com' : 'http://localhost:8000'

export default {
  components: {
    Logo,
    Datepicker,
    ModalAddAppointment
  },
  data () {
    return {
      value: '',
      hour: '',
      appointments: {},
      appointmentsSelected: null
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.appointments = {}
        return
      }
      this.loadDay()
    }
  },
  computed: {
    isWeekend () {
      if (this.value) {
        const dayOfWeek = moment(this.value).day()
        return dayOfWeek === 6 || dayOfWeek === 0
      }
      return false
    }
  },
  methods: {
    loadDay () {
      this.$axios.$get(`${api}/appointments/date/${this.value}`)
        .then((response) => {
          this.appointments = response.reduce((curr, val) => {
            curr[val.hour] = val
            return curr
          }, {})
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    showModal (idx) {
      this.hour = (idx + 8).toString()
      this.appointmentsSelected = this.appointments[this.hour]
      this.$bvModal.show('modal-1')
    },
    remove (id) {
      const resp = confirm('are you sure?')
      if (resp) {
        const app = this.appointments[id.toString()]
        if (app) {
          this.$axios.$delete(`${api}/appointment/${app.id}`)
            .then((response) => {
              this.loadDay()
            })
            .catch((error) => {
              console.error(error)
            })
        }
      }
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.pointer {
  cursor: pointer;
}
</style>
