<template>
    <div class="q-pa-md">
      <div class="q-pa-md">
        <q-btn icon="add" @click="onCreate" />
      </div>
      <q-table
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"
      >
      <template v-slot:body-cell-actions = "props">
        <q-td :props="props">
          <q-btn
            flat
            dense
            round
            icon="mode_edit"
            @click="onEdit(props.row.UserID)"
            />
          <q-btn
            flat
            dense
            round
            icon="delete"
            @click="onDelete(props.row.UserID)"
          />
        </q-td>
      </template>
    </q-table>
    </div>
  </template>

  <script setup>
    import { ref } from 'vue'
    import router from '../../router'

    const columns = [
    { name: 'UserID', align: 'center', label: 'รหัสสมาชิก', field: 'UserID', sortable: true },
    { name: 'UserName', align: 'center', label: 'ชื่อสมาขิก', field: 'UserName', sortable: true },
    { name: 'Password', align: 'center', label: 'รหัสผ่าน', field: 'Password', sortable: true },
    { name: 'Status', align: 'center', label: 'สถานะ', field: 'Status', sortable: true },
    { name: 'Role', align: 'center', label: 'ตำแหน่ง', field: 'Role', sortable: true },
    { name: 'actions', align: 'center', label: 'id', field: 'id', sortable: true }
    ]


    const rows = ref([])

    const fetchData = async () => {
    fetch('http://localhost:8800/api/v1/users')
        .then(res => res.json()) 
        .then(result => {
        rows.value = result
        })
    }
    fetchData()

    const onCreate = () => {
    router.push('/createuser')
    }

    const onEdit = (id) => {
    router.push('updateuser/' + id)
    console.log(id)
    }

    const onDelete = (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
    };

    fetch(`http://localhost:8800/api/v1/users/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
        alert(result.message)
        console.log(result)
        if (result.status === "Ok") {
            router.push('/user')
        }
        fetchData()
    })
    .catch((error) => console.error(error));
    
    }
  </script>