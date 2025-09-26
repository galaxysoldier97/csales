export default {
    root: ({ props }) => ({
        class: [
            // Font
            'text-xs font-medium',

            // Alignments
            'inline-flex items-center',

            // Spacing
            'px-2 py-1',

            // Shape
            {
                'rounded-md': !props.rounded,
                'rounded-full': props.rounded
            },

            // Colors
            {
                'bg-gray-100 dark:bg-slate-800 dark:text-white text-gray-600': props.severity == null || props.severity == 'primary',
                'bg-red-100 text-red-700': props.severity == 'danger',
                'bg-yellow-100 text-yellow-800': props.severity == 'warning',
                'bg-green-100 text-green-700': props.severity == 'success',
                'bg-blue-100 text-blue-700': props.severity == 'info',
                'bg-indigo-100 text-indigo-700': props.severity == 'indigo',
                'bg-purple-100 text-purple-700': props.severity == 'purple',
                'bg-pink-100 text-pink-700': props.severity == 'pink'
            }
        ]
    }),
    value: {
        class: 'leading-normal'
    },
    icon: {
        class: 'mr-1 text-xs'
    }
};
