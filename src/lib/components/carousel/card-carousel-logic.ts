// window_element refers to the actual Div element of the window (absolutely positioned div) to edit styles/classes on
// window_width refers to the width of the carousel window aka the relatively positioned container
// card_width refers to the width of each individual card.
// full_width refers to the full width of the carousel, including the hidden bits (aka absolutely positioned container)
// curr_left is the current "left" position value.
// margin is the gutter between each card. not applicable to the first and last elements.
// box_shadow_extend is the extension radius of the card box shadow. used when the window is at the very end to show the box shadow

//Note that the full_width will always be (given n = number of cards):
// [(card_width)n + (margin)(n-1)]px

function move_right(
    full_width:number,
    left_bound:number, right_bound:number,
    curr_left: number, 
    card_width:number, margin:number, box_shadow_extend:number
) {
    const window_width = right_bound-left_bound;
    const reached_end = right_bound+window_width >= full_width;
    let end_left:number;
    let new_left_bound:number;
    let new_right_bound:number;

    if (reached_end) {
        // The exact left style value to make it exactly to the right
        end_left = -1*((full_width+box_shadow_extend)-window_width);
        new_left_bound = full_width-window_width;
        new_right_bound = full_width;
    } else {
        const shown_num_cards = Math.floor(window_width/(card_width+margin));
        const num_full_cards_length = (card_width+margin)*shown_num_cards;

        end_left = curr_left-num_full_cards_length;
        new_left_bound = left_bound + num_full_cards_length;
        new_right_bound = right_bound + num_full_cards_length;
    }

    return {
        left: new_left_bound, 
        right: new_right_bound,
        keyframe: generate_key_frame(curr_left, end_left)
    };
}

function move_left(
    full_width:number,
    left_bound:number, right_bound:number,
    curr_left: number, 
    card_width:number, margin:number, box_shadow_extend:number
) {
    const window_width = right_bound-left_bound;
    const reached_end = left_bound-window_width <= full_width;

    let end_left:number;
    let new_left_bound:number;
    let new_right_bound:number;

    if (reached_end) {
        end_left = 0;
        new_left_bound = 0;
        new_right_bound = window_width;
    } else {
        end_left = curr_left-window_width 
        new_left_bound = left_bound-window_width;
        new_right_bound = right_bound-window_width;
    }

    return {
        left: new_left_bound, 
        right: new_right_bound,
        keyframe: generate_key_frame(curr_left, end_left)
    };
}

function convert_dimensions(full_width: number, window_width:number, left_or_right:number) {
    // Converts a "left" style property to its right variant 
    // and vice versa while maintaining the position of the element.
    return -1*(full_width-window_width+left_or_right);
}

function check_end_reached(
    full_width:number, window_width:number, 
    active_position:number, active_pos_direction:string, operation:string,
    box_shadow_extend:number, num_full_cards_length:number
) {
    // Calculates whether the end will be reached after a move-left/move-right
    // reduce redudancy later
    if (operation == "left") {
        if (active_pos_direction == "left") {
            return active_position+window_width >= box_shadow_extend;
        } else {
            return (num_full_cards_length+active_position)+window_width >= box_shadow_extend;
        }
    } else {
        if (active_pos_direction == "right") {
            return active_position+window_width >= box_shadow_extend;
        } else {
            return (num_full_cards_length+active_position)+window_width >= box_shadow_extend;
        }
    }

}

function render_arrow_check(
    setLeftFunction:Function, setRightFunction:Function,

) {

}

function generate_key_frame(start_left:number, end_left:number) {
    return `
    @keyframes move {
        from {left: ${start_left}px;}
        to {left: ${end_left}px;}
    }
    
    .start-animation {
        animation: move 0.5s ease-out both;
    }
    `
}

export {move_left, move_right}