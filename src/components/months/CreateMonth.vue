<template>
    <div class="create-month">
        <div class="text-center">
            <create @triggerModal="modal"></create>
        </div>
    </div>
</template>

<script>

import Create from "src/components/App/Create";

export default {
    name: "CreateMonth",
    components: {
        Create
    },
    methods: {
        modal(val) {
            this.$store.dispatch('general/createMonthDialog',true)
        }
    }
}
</script>

<style scoped>

</style>
