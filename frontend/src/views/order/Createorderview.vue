<template>
    <div class="q-gutter-md" style="max-width:400px">
        <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="order_id" label="Order ID" />
            <q-input v-model="customer_id" label="Customer ID" />

            <!-- DateTime Picker -->
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
            <q-btn type="submit" label="Submit" color="primary" />
        </q-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const order_id = ref('');
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

const onSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (!order_date.value || !order_time.value) {
        alert("Please select both date and time.");
        return;
    }
    // แปลง order_date ให้อยู่ในรูปแบบ ISO 8601 ที่ Prisma รองรับ
    const formattedDate = order_date.value.replace(/\//g, '-');
    const formattedDateTime = `${formattedDate}T${order_time.value}:00Z`;

    const raw = JSON.stringify({
        order_id: Number(order_id.value),   
        customer_id: Number(customer_id.value),
        order_date: formattedDateTime, 
        order_status: order_status.value, // ใช้ค่าจาก dropdown
        total_amount: parseFloat(total_amount.value)
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8800/api/v1/orders", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        alert(result.message);
        if (result.status === "success") {
            router.push('/order');
        }
    })
    .catch((error) => console.error(error)); 
}
</script>
