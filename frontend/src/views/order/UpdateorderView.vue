<template>
    <div class="q-gutter-md" style="max-width:400px">
        <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="order_id" label="Order ID" disable /> 
            <q-input v-model="customer_id" label="Customer ID" />

            <q-input v-model="formattedDateTime" label="Order Date & Time" readonly @click="showDateTimePicker = true">
                <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer" @click="showDateTimePicker = true" />
                </template>
            </q-input>
            <q-dialog v-model="showDateTimePicker">
                <q-card>
                    <q-card-section>
                        <q-date v-model="order_date" @update:model-value="updateFormattedDateTime" />
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <q-time v-model="order_time" format24h @update:model-value="updateFormattedDateTime" />
                    </q-card-section>
                    <q-separator />
                    <q-card-actions align="right">
                        <q-btn flat label="OK" color="primary" @click="showDateTimePicker = false" />
                    </q-card-actions>
                </q-card>
            </q-dialog>

            <q-select 
                v-model="order_status" 
                label="Order Status" 
                :options="orderStatusOptions"
                emit-value 
                map-options
            />
            
            <q-input v-model="total_amount" label="Total Amount" />
            <q-btn type="submit" label="Update Order" color="primary" />
        </q-form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const order_id = ref(route.params.id);
const customer_id = ref('');
const order_date = ref('');
const order_time = ref('');
const order_status = ref('');
const total_amount = ref('');

const showDateTimePicker = ref(false);
const formattedDateTime = ref('');

const updateFormattedDateTime = () => {
    if (order_date.value && order_time.value) {
        formattedDateTime.value = `${order_date.value} ${order_time.value}`;
    }
};

const orderStatusOptions = [
    { label: "Processing", value: "processing" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" }
];

// 📌 ฟังก์ชันดึงข้อมูล Order ที่ต้องการแก้ไข
const fetchData = () => {
    fetch(`http://localhost:8800/api/v1/orders/${order_id.value}`)
    .then(res => res.json())
    .then(result => {
        customer_id.value = result.customer_id;
        order_status.value = result.order_status;
        total_amount.value = result.total_amount;

        const parsedDate = new Date(result.order_date);
        order_date.value = parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        order_time.value = parsedDate.toISOString().split('T')[1].slice(0,5); // HH:MM
        updateFormattedDateTime();
    })
    .catch(error => console.error("Error fetching order data:", error));
};

// 📌 เรียกใช้ fetchData() เมื่อ Component โหลด
onMounted(fetchData);

const onSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const formattedDate = order_date.value.replace(/\//g, '-');
    const formattedDateTime = `${formattedDate}T${order_time.value}:00Z`;

    const raw = JSON.stringify({
        customer_id: Number(customer_id.value),
        order_date: formattedDateTime,
        order_status: order_status.value,
        total_amount: parseFloat(total_amount.value)
    });

    const requestOptions = {
        method: "PUT", 
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch(`http://localhost:8800/api/v1/orders/${order_id.value}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        if (result.status === "success") {
            router.push('/order'); 
        }
    })
    .catch(error => console.error("Error updating order:", error));
}
</script>


