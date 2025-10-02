// Step Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Step form elements
    const form = document.getElementById('pin-form');
    const steps = Array.from(document.querySelectorAll('.pin-form-step'));
    const formSteps = [
        document.getElementById('step-1'),
        document.getElementById('step-2')
    ];
    const adicionalBtn = document.getElementById('adicional-pin');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const saveBtn = document.getElementById('save-pin');
    let currentStep = 1;

    // Initialize the form
    initializeForm();

    function initializeForm() {
        showStep(1);
        updateButtonsState();
        
        // Add event listeners
        prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
        nextBtn.addEventListener('click', () => handleNextStep());
        
        // Add input event listeners for validation
        addInputValidationListeners();
    }

    function showStep(stepNumber) {
        formSteps.forEach((step, index) => {
            step.style.display = index + 1 === stepNumber ? 'block' : 'none';
            step.classList.toggle('active', index + 1 === stepNumber);
        });

        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === stepNumber);
            step.classList.toggle('completed', index + 1 < stepNumber);
        });

        currentStep = stepNumber;
        updateButtonsState();
    }

    function updateButtonsState() {
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
        nextBtn.style.display = currentStep < 2 ? 'block' : 'none';
        saveBtn.style.display = currentStep === 2 ? 'block' : 'none';
        adicionalBtn.style.display = currentStep === 1 ? 'block' : 'none';
    }

    function handleNextStep() {
        if (validateCurrentStep()) {
            goToStep(currentStep + 1);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Campos requeridos',
                text: 'Por favor complete todos los campos obligatorios antes de continuar.',
                confirmButtonColor: '#001550'
            });
        }
    }

    function goToStep(step) {
        if (step >= 1 && step <= 2) {
            showStep(step);
        }
    }

    function validateCurrentStep() {
        const currentFormStep = formSteps[currentStep - 1];
        const requiredInputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showInputError(input);
            } else {
                removeInputError(input);
            }
        });

        return isValid;
    }

    function showInputError(input) {
        input.classList.add('error');
        input.style.borderColor = '#ff0000';
    }

    function removeInputError(input) {
        input.classList.remove('error');
        input.style.borderColor = '';
    }

    function addInputValidationListeners() {
        const allInputs = form.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            input.addEventListener('input', () => removeInputError(input));
            input.addEventListener('change', () => removeInputError(input));
        });
    }

    // Material selection handler
    const materialesSelect = document.getElementById('Materiales');
    const materialesContainer = document.getElementById('materiales-container');

    materialesSelect.addEventListener('change', function() {
        materialesContainer.style.display = 
            this.value === 'con_materiales' ? 'block' : 'none';
    });
});