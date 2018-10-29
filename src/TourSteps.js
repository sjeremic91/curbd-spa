export default [
  {
    name: 'logo',
    target: '#logo',  // We're using document.querySelector() under the hood
    heading: 'Welcome!',
    content: `Press logo to open sidebar`,
  },
  {
    name: 'sidebar',
    target: '#sidebar-truck',
    heading: 'Sidebar',
    content: 'Here you can see your Orders and Trucks. Choose Trucks option to continue.',
  },
  {
    name: 'add-truck',
    target: '#add-truck-btn',
    heading: 'Add Truck',
    content: 'Click on the Add Truck Button',
    scrollDisabled: true
  },
  {
    name: 'general-form',
    target: '#general-form',
    content: 'Fill the required fields, then press continue',
    hasContinue: true,
  },
  {
    name: 'step-boundaries',
    target: '#step-boundaries',
    content: 'Click on Boundaries to proceed',
    scrollDisabled: true
  },
  {
    name: 'boundaries-form',
    target: '#boundaries-form',
    content: 'Fill the required fields, check the days you work, and fill from/to time for given shifts.<br> If you don\'t have second shift leave those fields empty. Then press continue',
    hasContinue: true,
  },
  {
    name: 'step-location',
    scrollDisabled: true,
    target: '#step-location',
    content: 'Click on Location to proceed',
  },
  {
    name: 'location-form',
    target: '#location-form',
    content: 'Fill the required fields, then press continue',
    hasContinue: true,
  },
  {
    name: 'gmap',
    target: '#gmap',
    content: 'Move marked to desired position, then press continue',
    hasContinue: true,
    continueDisabled: false
  },
  {
    name: 'save-truck',
    target: '#save-truck',
    scrollDisabled: true,
    content: 'Almost done! Click here to create Truck',
  },
  {
    name: 'truck-card',
    target: '.truck-card:last-child',
    content: 'This is your truck, here you can se basic data about it',
    hasContinue: true,
    continueDisabled: false,
    unclickable: true
  },
  {
    name: 'btn-edit-truck',
    target: '.truck-card:last-child .btn-edit',
    content: 'Click on edit icon, to procced',
  },
  {
    name: 'step-menu',
    scrollDisabled: true,
    target: '#step-menu',
    heading: 'Menu',
    content: 'Click on menu icon to create categories and menu',
  },
  {
    name: 'categories',
    scrollDisabled: true,
    target: '#btn-categories',
    heading: 'Categories',
    content: 'Click on categories to add your first category',
  },
  {
    name: 'category-input',
    target: '#input-category',
    hasContinue: true,
    heading: 'Categories',
    content: 'Type name of your first category, then press next',
  },
  {
    name: 'btn-add-category',
    target: '#btn-add-category',
    heading: 'Add Category',
    content: 'Press button to create category',
  },
  {
    name: 'btn-close-category-modal',
    target: '#modal-categories button.close',
    content: 'Press button to close modal',
  },
  {
    name: 'btn-add-meal',
    target: '#btn-add-meal',
    heading: 'Meal',
    scrollDisabled: true,
    content: 'Press button to create your first meal',
  },
  {
    name: 'form-meal',
    target: '#form-meal',
    heading: 'Meal',
    hasContinue: true,
    content: 'Fill the form then press next',
  },
  {
    name: 'btn-save-meal',
    target: '#btn-save-meal',
    heading: 'Meal',
    content: 'Press button to save your first meal',
  },
  {
    name: 'meal-card',
    target: '.meal-card:last-child',
    heading: 'Meal',
    content: 'This is Meal card ... ',
    hasContinue: true,
    scrollDisabled: true,
    unclickable: true,
    continueDisabled: false
  },
  {
    name: 'btn-meal-info',
    target: '.meal-card:last-child .btn-meal-info',
    heading: 'Meal Condiments',
    content: 'Press items button to preview and add meal condiments',
  },
  {
    name: 'btn-add-condiment',
    target: '#btn-add-condiment',
    heading: 'Add Meal Condiment',
    content: 'Press button to create new meal condiment',
  },
]
