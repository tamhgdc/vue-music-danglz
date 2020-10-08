<template>
    <button :class="{hovered: isHovered}">
        <slot></slot>
    </button>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class Button extends Vue {
    @Prop(Boolean) readonly isHovered?: boolean
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

        &:hover, &.hovered
            background-color buttonface

        &:active
            background-color #e8e8e8
</style>
