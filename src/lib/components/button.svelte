<script lang="ts">
    let {
        children,
        onClick=null,
        buttonClasses=""
    } = $props();

    let button:HTMLButtonElement;
    let span:HTMLSpanElement;
    let set_ripple_size = $state(false);

    function change_ripple_size() {
        // Dynamically changes the size of the ripple based on the size of the button.
        const {left, top, right, bottom} = button.getBoundingClientRect();
        const height = bottom-top;
        const width = right-left;
        const smallestDim = height > width ? width : height;
        span.style.width = (smallestDim/2).toString() + "px"
        span.style.height = (smallestDim/2).toString() + "px"
    }

    function ripple_handler(e: MouseEvent) {
        if (!set_ripple_size) {change_ripple_size()}
        const buttonRect = button.getBoundingClientRect();
        const {left, top} = buttonRect
        const leftPosition = e.clientX - left
        const topPosition = e.clientY - top

        span.style.left = leftPosition.toString() + "px"
        span.style.top = topPosition.toString() + "px"
        

        span.classList.add("active")

        onClick();

        setTimeout(() => {
            span.classList.remove("active")
        }, 600)
    }
</script>

<style>
    @keyframes rippleEffect {
        0% {opacity: 0.5; transform: scale(0);}
        100% {opacity: 0; transform: scale(20);}
    }
    .ripple-class {
        border-radius: 50%; position: absolute; background-color: white; opacity: 0;
    }
    .ripple-class.active {
        animation: rippleEffect 0.9s ease-out infinite;
    }
    .cursor-change:hover {
        cursor: pointer;
    }
    .grey-hover:hover {
        background-color: rgb(220,220,220);
    }
</style>

<button bind:this={button} class={`relative overflow-hidden cursor-change ${buttonClasses}`} onclick={ripple_handler}>
    {@render children()} 
    <span bind:this={span} class="ripple-class"></span>
</button>

