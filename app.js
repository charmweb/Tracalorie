// Storage Controller
const StorageCtrl = (function() {
  // Public Methods
  return {
    storeItem: function(item) {
      let items;
      // Check if any items in LS
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what already is in LS
        items = JSON.parse(localStorage.getItem("items"));
        // Push new item
        items.push(item);
        // Reset LS
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
          // the third parameter tells to replace the deleted item with the updatedItem
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controller  =================================
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   // empty array
    //   //   { id: 0, name: "Stake Dinner", calories: 1200 },
    //   //   { id: 1, name: "Cookie", calories: 400 },
    //   //   { id: 2, name: "Eggs", calories: 300 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public Methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories, 10); // from string to number
      // Create new Item
      const newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);
      return newItem; // because we will put it in a variable down below
    },
    getItemById: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // This will update the item in the data structure not in the UI
      // Calories to number
      calories = parseInt(calories, 10);
      let found = null;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get the ids
      const ids = data.items.map(item => {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id); // gets the index of currentItem in the data.items
      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(itemToEdit) {
      data.currentItem = itemToEdit;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;
      // Loop through items and add calories
      data.items.forEach(item => {
        total += item.calories;
      });
      // Set total cal in data structure
      data.totalCalories = total;
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI Controller  =============================
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  // Public Methods
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        </li>
        `;
      });
      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      // returning an object with the input values
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add Id
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
        <strong>${item.name}: </strong><em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
        `;
      // Insert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn NodeList into array
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
          `;
        }
      });
    },
    deleteListItem: function(currentItem) {
      const itemID = `#item-${currentItem.id}`;
      const item = document.querySelector(`${itemID}`);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      // to update it
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems); // returns a NodeList
      // Convert NodeList to Array
      listItems = Array.from(listItems);
      console.log(listItems);
      listItems.forEach(item => item.remove());
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller ====================================
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    //todo has to be called in App.init 123
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);
    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener("click", e => {
      UICtrl.clearEditState();
      e.preventDefault();
    });
    //  Clear items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", e => {
        clearAllItemsClick();
        e.preventDefault();
      });
  };

  // Add Item Submit  ============
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // Check for name and calorie input
    if (input.name !== "" && input.calories !== "") {
      // Add Item //todo in the ItemCtrl
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add Item to UI list
      UICtrl.addListItem(newItem);
      // Do the below instead of creating li in UICtrl.addListItem
      //   const items = ItemCtrl.getItems();
      //   //   console.log(ItemCtrl.getItems());
      //   // Populate list with items
      //   UICtrl.populateItemList(items);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in LocalStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();

      // UICtrl.populateItemList();
    }
    e.preventDefault();
  };
  // Clear items click ======================
  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from Local Storage
    StorageCtrl.clearItemsFromStorage();

    // Hide the UL
    UICtrl.hideList();
  };
  // Delete button Event =======================
  const itemDeleteSubmit = function(e) {
    // Get curent Item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // Delete from UI
    UICtrl.deleteListItem(currentItem);
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Click Edit Item ==========================
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get the list item id
      const listId = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArr = listId.split("-");
      // console.log(listIdArr);   ==> Array [ "item", "0" ]
      // Get the actual id
      const id = parseInt(listIdArr[1], 10);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // Update Item Submit ====================
  const itemUpdateSubmit = function(e) {
    // Get Item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update Local Storage
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Public methods vvvvvvvvvvvvvvv
  return {
    init: function() {
      // Clear edit state / set initial state
      UICtrl.clearEditState();
      // Fetch items form data structure
      const items = ItemCtrl.getItems();
      // Check if any items
      if (items.length === 0) {
        // Hide ul if empty
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event Listeners    //todo 123
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App

App.init();
