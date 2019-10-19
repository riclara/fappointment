<template>
  <div>
    <b-modal
      :id="id"
      ref="modal"
      title="Add Appointment"
      @hidden="onReset"
      @ok="onSubmit"
    >
      <div v-if="message" class="m-2 alert alert-warning" role="alert">
        {{ message }}
      </div>
      <div v-if="detailMessages.length" class="m-2 alert alert-warning" role="alert">
        <ul>
          <li
            v-for="(detail, idx) in detailMessages"
            :key="idx"
          >
            {{ detail.message }}
          </li>
        </ul>
        {{ message }}
      </div>
      <b-form v-if="show">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
          description="We'll never share your email with anyone else."
        >
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter email"
          />
        </b-form-group>

        <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
          <b-form-input id="input-2" v-model="form.name" required placeholder="Enter name" />
        </b-form-group>

        <b-form-group id="input-group-4" label="Description:" label-for="input-3">
          <b-form-input id="input-3" v-model="form.description" required placeholder="Enter description" />
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    hour: {
      type: String,
      required: true
    },
    appointment: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      form: {
        email: '',
        name: '',
        description: ''
      },
      show: true,
      message: '',
      detailMessages: []
    }
  },
  computed: {
    ...mapState('common', ['api'])
  },
  watch: {
    appointment (val) {
      if (val) {
        this.form.email = this.appointment.email
        this.form.name = this.appointment.name
        this.form.description = this.appointment.description
      }
    },
    message (val) {
      if (val.length) {
        setTimeout(() => {
          this.message = ''
        }, 5000)
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      const dateSplit = this.date.split('-')
      this.form.year = dateSplit[0]
      this.form.month = dateSplit[1]
      this.form.day = dateSplit[2]
      this.form.hour = this.hour
      if (this.appointment) {
        this.$axios.$put(`${this.api}/appointment/${this.appointment.id}`, this.form)
          .then((response) => {
            this.$emit('submitted', response)
            this.$refs.modal.hide()
          })
          .catch((error) => {
            if (error.response && error.response.status === 422) {
              this.detailMessages = error.response.data.error.details
            } else {
              this.message = 'Error: please contact us'
            }
          })
      } else {
        this.$axios.$post(`${this.api}/appointment`, this.form)
          .then((response) => {
            this.$emit('submitted', response)
            this.$refs.modal.hide()
          })
          .catch((error) => {
            if (error.response && error.response.status === 422) {
              this.detailMessages = error.response.data.error.details
            } else {
              this.message = 'Error: please contact us'
            }
          })
      }
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      this.form.description = ''
      this.show = false
      this.message = ''
      this.detailMessages = []
      // Trick to reset/clear native browser form validation state
      this.$nextTick(() => {
        this.show = true
      })
      this.$refs.modal.hide()
    }
  }
}
</script>
