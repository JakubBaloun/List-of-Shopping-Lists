import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // English translations go here
      'listOfShoppingLists': 'List of Shopping Lists',
      'logout': 'Logout',
      'darkMode': 'Dark mode',
      'login': 'Login',
      'password': 'Password',
      'enterEmail': 'Enter email',
      'noAccount': 'No account yet? Click here to register!',
      'username': 'Username',
      'enterUsername': 'Enter username',
      'registration': 'Register',
      'register': 'Register',
      'account': 'Already have and account? Click here to log in!',
      'showArchived': 'Show Archived',
      'noListsAvailable': 'No shopping lists available for you to see.',
      'nameOfShoppingList': 'Name of the shopping list', 
      'createNewList': 'Create new shopping list',
      'chooseUser': 'Choose user',
      'chosenUsers': 'Chosen users',
      'itemName': 'Item name',
      'newItems': 'New items of the list',
      'addItem': 'Add item',
      'close': 'Close',
      'create': 'Create',
      'noEmptyName': 'Name of the list cannot be empty.',
      'ownerIsMember': 'Owner cannot be member of the list.',
      'items': 'Items',
      'owner': 'Owner',
      'cancel': 'Cancel',
      'delete': 'Delete',
      'delConfirmation': 'Are you sure you want to delete the shopping list ',
      'editName': 'Edit name',
      'save': 'Save',
      'showAllItems': 'Show all items',
      'shoppingListItems': 'Shopping list items',
      'shoppingListMembers': 'Shopping list memberes',
      'remove': 'Remove',
      'addNewMember': 'Add new member',
      'addMember': 'Add member',
      'showMembers': 'Show members'
    },
  },
  cs: {
    translation: {
      // Czech translations go here
      'listOfShoppingLists': 'Seznam nákupních seznamů',
      'logout': 'Odhlásit',
      'darkMode': 'Tmavý režim',
      'login': 'Přihlásit',
      'password': 'Heslo',
      'enterEmail': 'Zadejte email',
      'noAccount': 'Ještě nemáte účet? Klikněte zde a zaregistrujte se!',
      'username': 'Uživatelské jméno',
      'enterUsername': 'Zadejte uživatelské jméno',
      'registration': 'Registrace',
      'register': 'Registrovat',
      'account': 'Už máte účet? Klikněte sem a přihlaste se!',
      'showArchived': 'Zobrazit archivované',
      'noListsAvailable': 'Nemáte žádné nákupní seznamy k zobrazení.',
      'nameOfShoppingList': 'Název nákupního seznamu', 
      'createNewList': 'Vytvořit nový nákupní seznam',
      'chooseUser': 'Vyberte uživatele',
      'chosenUsers': 'Vybraní uživatelé',
      'itemName': 'Název položky',
      'newItems': 'Nové položky seznamu',
      'addItem': 'Přidat položku',
      'close': 'Zavřít',
      'create': 'Vytvořit',
      'noEmptyName': 'Název seznamu nesmí být prázdný.',
      'ownerIsMember': 'Autor nemůže být zároveň členem.',
      'items': 'Položky',
      'owner': 'Majitel',
      'cancel': 'Zrušit',
      'delete': 'Smazat',
      'delConfirmation': 'Jste si jistý, že chcete smazat nákupní seznam ',
      'editName': 'Změnit jméno',
      'save': 'Uložit',
      'showAllItems': 'Zobrazit všechny položky',
      'shoppingListItems': 'Položky seznamu',
      'shoppingListMembers': 'Členové seznamu',
      'remove': 'Odebrat',
      'addNewMember': 'Přidat nového uživatele',
      'addMember': 'Přidat člena',
      'showMembers': 'Zobrazit členy'
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en', // Fallback language in case translation is missing
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
