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
            @click="onEdit(props.row.order_id)"
            />
          <q-btn
            flat
            dense
            round 
            icon="delete"
            @click="onDelete(props.row.order_id)"
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
  { name: 'order_id', align: 'center', label: 'รหัสออเดอร์', field: 'order_id', sortable: true },
  { name: 'customer_id', align: 'center', label: 'รหัสลูกค้า', field: 'customer_id', sortable: true },
  { name: 'order_date', align: 'center', label: 'วันที่สั่ง', field: 'order_date', sortable: true },
  { name: 'order_status', align: 'center', label: 'สถานะออเดอร์', field: 'order_status', sortable: true },
  { name: 'total_amount', align: 'center', label: 'จำนวน', field: 'total_amount', sortable: true },
  { name: 'actions', align: 'center', label: 'id', field: 'id', sortable: true }
]

const rows = ref([])

const fetchData = async () => {
  fetch('http://localhost:8800/api/v1/orders')
    .then(res => res.json()) 
    .then(result => {
      rows.value = result
    })
}
fetchData()

const onCreate = () => {
  router.push('/createorder')
}

const onEdit = (id) => {
  router.push('updateorder/' + id)
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

fetch(`http://localhost:8800/api/v1/orders/${id}`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    alert(result.message)
    console.log(result)
    if (result.status === "Ok") {
        router.push('/order')
    }
    fetchData()
  })
  .catch((error) => console.error(error));
  
}

</script>