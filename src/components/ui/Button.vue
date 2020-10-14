<template>
    <button :class="{hovered: isHovered}">
        <Loader v-if="isLoading" color="#ad86e2" size="52px" extraClass="loader" />
        <slot></slot>
    </button>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import Loader from '@/components/ui/Loader.vue'

@Component({
  components: {
    Loader
  }
})
export default class Button extends Vue {
    @Prop(Boolean) readonly isHovered?: boolean
    @Prop(Boolean) readonly isLoading?: boolean
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
        position relative

        .loader
            position: absolute
            top: 0
            left: 0

        &:hover, &.hovered
            background-color buttonface

        &:active
            background-color #e8e8e8
    // @media only screen and (max-width: 48em)
    //     button
    //         padding 0.5rem
</style>
