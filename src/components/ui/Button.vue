<template>
    <button>
        <slot></slot>
    </button>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Button extends Vue {
}
</script>
<style lang="stylus" scoped>
    button
        border-radius 50%
        padding 1rem
        border none
        outline none
        background-color transparent
        cursor pointer
        transition 100ms ease-in-out

        &:hover
            background-color buttonface

        &:active
            background-color #e8e8e8
</style>
