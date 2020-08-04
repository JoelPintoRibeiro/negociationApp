export default {
    methods: {
        isNumericMixin(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46 && charCode !== 44) {
                evt.preventDefault();
            } else {
                return true;
            }
        },
        getFloatNumber(val) {
            return parseFloat(val.replace(',', '.').replace(' ', ''))
        }
    }
};