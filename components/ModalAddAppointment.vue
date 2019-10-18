<template>
  <div>
    <b-modal
      :id="id"
      title="Add Appointment"
      ref="modal"
      @hidden="onReset"
      @ok="onSubmit"
    >
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
    appointment: Object
  },
  data () {
    return {
      form: {
        email: '',
        name: '',
        description: ''
      },
      show: true
    }
  },
  watch: {
    appointment (val) {
      if (val) {
        this.form.email = this.appointment.email
        this.form.name = this.appointment.name
        this.form.description = this.appointment.description
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
      this.$axios.$post('http://localhost:8000/appointment', this.form)
        .then((response) => {
          this.$emit('submitted', response)
          this.$refs.modal.hide()
        })
        .catch((error) => {
          console.error(error.response)
        })
    },
    onReset (evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.email = ''
      this.form.name = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
      this.$refs.modal.hide()
    }
  }
}
</script>
