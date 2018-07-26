var vm = new Vue({
  el: '#app',
  data: {
    old_pass:"",
    new_pass:"",
    repeat_pass:"",
    Datos: {},
    Tareas: [],
    newTarea: {
      'description': null,
      'pending': true,
      'id_name': null,
    },
    currentTarea: {},
    delTareas: [],
    loading: false,
    token: localStorage.token,
    name: localStorage.name,
    // local: localStorage.todo
  },
  mounted: function() {
    this.getDatos();
    this.verify();
    this.getTareas();
  },
  methods: {
    change_pass: function () {
      loading: true,
      this.$http.post('http://127.0.0.1:8000/change/', this.password , {
        headers: {
          Authorization: "Token " + (localStorage.token)
        },
      })
      .then((response) => {
        loading: false,
        console.log(response);
        this.Datos = response
      })
      .catch((err) => {
        loading: false,
        console.log(err);
      })
    },

    rellenar: function() {
      this.newTarea.id_name = this.Datos.id
    },

    clearLS: function() {
      localStorage.clear();
    },

    getDatos: function() {

      this.loading = true;
      this.$http.get('http://127.0.0.1:8000/user/', {
          headers: {
            Authorization: "Token " + (localStorage.token),
          },
        })
        .then((response) => {
          this.Datos = response.data[0];
          localStorage.id = this.Datos.id
          this.id = localStorage.id
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })
    },

    verify: function() {
      this.loading = true;
      this.$http.post('http://127.0.0.1:8000/api-token-verify/', {
          token: localStorage.token
        })
        .then((response) => {
          localStorage.token = response.data.token;

          // this.tareas = response.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          window.location.replace("/");
          console.log(err);
        })
    },
    getTareas: function() {
      this.loading = true;
      this.$http.get('http://127.0.0.1:8000/tareas/', {
          headers: {
            Authorization: "Token " + (localStorage.token),
          },
        })
        .then((response) => {

          this.Tareas = response.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })

    },

    getTarea: function(id) {
      this.loading = true;
      this.$http.get('http://127.0.0.1:8000/tareas/' + id + '/', {
          headers: {
            "Authorization": "Token " + (localStorage.token),
          },
        })
        .then((response) => {
          this.currentTarea = response.data;
          $("#edit").modal('show');
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })
    },
    addTarea: function() {

      this.loading = true;
      this.$http.post('http://127.0.0.1:8000/tareas/', this.newTarea, {
          headers: {
            "Authorization": "Token " + (localStorage.token),
          },
        })
        .then((response) => {
          this.loading = false;
          this.Tareas.push(response.data);
          this.newTarea.description = "";
          this.newTarea.description = "";
          $('#add').modal('hide');

        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })
    },
    updateTarea: function(id) {
      this.loading = true;
      this.$http.put('http://127.0.0.1:8000/tareas/' + id + '/', this.currentTarea, {
          headers: {
            "Authorization": "Token " + (localStorage.token),
          },
        })
        .then((response) => {
          this.loading = false;
          this.getTareas();
          $('#edit').modal('hide');
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })
    },
    deleteTarea: function(id) {
      this.loading = true;
      this.$http.delete('http://127.0.0.1:8000/tareas/' + id + '/', {
          headers: {
            "Authorization": "Token " + (localStorage.token),
          },
        })
        .then((response) => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        })
    },

    deleteTareas: function() {
      this.loading = true;
      for (var i = 0; i < this.Tareas.length; i++) {
        if (!this.Tareas[i].pending) {
          this.loading = true;
          this.$http.delete('http://127.0.0.1:8000/tareas/' + this.Tareas[i].id + '/', {
              headers: {
                "Authorization": "Token " + (localStorage.token),
              },
            })
            .then((response) => {
              this.loading = false;
              for (var i = 0; i < this.Tareas.length; i++) {
                if (!this.Tareas[i].pending) {
                  this.Tareas.pop(i);
                }
              }
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            })
        }
      }
    },
    marcar: function(data) {
      data.pending = !data.pending;

      if (data.pending) {
        this.loading = true;
        this.$http.put('http://127.0.0.1:8000/tareas/' + data.id + '/', data, {
            headers: {
              "Authorization": "Token " + (localStorage.token),
            },
          })
          .then((response) => {
            this.loading = false;
            this.currentTarea = response.data;
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
      } else {
        this.loading = true;
        this.$http.put('http://127.0.0.1:8000/tareas/' + data.id + '/', data, {
            headers: {
              "Authorization": "Token " + (localStorage.token),
            },
          })
          .then((response) => {
            this.loading = false;
            this.currentTarea = response.data;
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          })
      }
    },
    // marcartodo: function check1(checkbox) {
    //   if (checkbox.checked){
    //     getElementsyild('checks').checked = true
    //   }else{
    //
    //   }
    // }
  },
});
