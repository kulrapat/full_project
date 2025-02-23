<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '../router'

const columns = [
  { name: 'customer_id', align: 'center', label: 'รหัสลูกค้า', field: 'customer_id', sortable: true },
  { name: 'first_name', align: 'center', label: 'first_name', field: 'first_name', sortable: true },
  { name: 'last_name', align: 'center', label: 'last_name', field: 'last_name', sortable: true },
  { name: 'email', align: 'center', label: 'email', field: 'email', sortable: true },
  { name: 'address', align: 'center', label: 'address', field: 'address', sortable: true },
  { name: 'phone_number', align: 'center', label: 'phone_number', field: 'phone_number', sortable: true },
  { name: 'actions', align: 'center', label: 'id', field: 'id', sortable: true }
]

const rows = ref([])

const fetchData = async () => {
  fetch('http://localhost:8800/api/v1/customers')
    .then(res => res.json()) 
    .then(result => {
      rows.value = result
    })
}
fetchData()

</script>