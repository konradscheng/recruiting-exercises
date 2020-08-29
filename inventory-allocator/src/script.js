function allocateInventory(order, warehouses) {
  let allocation = new Map()

  for (let i = 0; i < warehouses.length; i++) {
    let warehouseInventory = Object.entries(warehouses[i].inventory)

    for (let j = 0; j < Object.entries(warehouses[i].inventory).length; j++) {
       //order needs warehouse object
       if (order[warehouseInventory[j][0]] > 0) {

        let warehouseOrder = allocation.get(warehouses[i].name)
           
         //warehouse does not exist in allocation yet
         if (!warehouseOrder) {
           warehouseOrder = {}
         }

         //fulfills entire order
         if (warehouseInventory[j][1] >= order[warehouseInventory[j][0]]) {

           warehouseOrder[warehouseInventory[j][0]] = order[warehouseInventory[j][0]]

           allocation.set(warehouses[i].name, warehouseOrder)
           order[warehouseInventory[j][0]] = 0
         //fulfills partial order
         } else {

           if (!warehouseOrder[warehouseInventory[j][0]]) {
             warehouseOrder[warehouseInventory[j][0]] = 0
           }

           warehouseOrder[warehouseInventory[j][0]] += warehouseInventory[j][1]

           allocation.set(warehouses[i].name, warehouseOrder)
           order[warehouseInventory[j][0]] -= warehouseInventory[j][1]
         }
       }
    }
  }

  let cannotFulfillOrder = false

  Object.values(order).forEach(function(value) {
    if (value > 0) {
      cannotFulfillOrder = true
      return
    }
  })

  if (cannotFulfillOrder) {
    return []
  }

  let allocationArray = []

  allocation.forEach(function(value, key) {
    let allocationEntry = {}
    allocationEntry[key] = value
    allocationArray.push(allocationEntry)
  })

  return allocationArray;
}

function shouldReturnEmptyArray(inputOrder, inputWarehouses) {
  let actual = JSON.stringify(allocateInventory(inputOrder, inputWarehouses))
  let expected = []
  return actual == expected ? "SUCCESS" : "FAILURE"
}

function validateCorrectResult(inputOrder, inputWarehouses, expectedResult) {
  let actual = JSON.stringify(allocateInventory(inputOrder, inputWarehouses))
  let expected = JSON.stringify(expectedResult)
  return actual == expected ? "SUCCESS" : "FAILURE"
}

function runTests() {
  let orderOne = { apple: 1 }
  let warehousesOne = [{ name: 'owd', inventory: { apple: 1 } }]
  let correctResultOne = [{ owd: { apple: 1 } }]

  let orderTwo = { apple: 10 }
  let warehousesTwo = [ { name: 'owd', inventory: { apple: 5 } }, { name: 'dm', inventory: { apple: 5 } } ]
  let correctResultTwo = [ { owd: { apple: 5 } }, { dm: { apple: 5 } }]

  let orderThree = { apple: 1 }
  let warehousesThree = [{ name: 'owd', inventory: { apple: 0 } }]
  let correctResultThree = []

  let orderFour = { apple: 2 }
  let warehousesFour = [{ name: 'owd', inventory: { apple: 1 } }]
  let correctResultFour = []

  let orderFive = { apple: 5, banana: 5, orange: 5 }
  let warehousesFive = [ { name: 'owd', inventory: { apple: 5, orange: 10 } }, { name: 'dm', inventory: { banana: 5, orange: 10 } } ]
  let correctResultFive = [ { owd: { apple: 5, orange: 5 } }, { dm: { banana: 5 } }]

  let orderSix = { apple: 15, banana: 15, orange: 15 }
  let warehousesSix = [ { name: 'owd', inventory: { apple: 25, orange: 11 } }, { name: 'dm', inventory: { banana: 16, orange: 4 } } ]
  let correctResultSix = [ { owd: { apple: 15, orange: 11 } }, { dm: { banana: 15, orange: 4 } }]

  let orderSeven = { apple: 5, banana: 5, orange: 5 }
  let warehousesSeven = [ { name: 'owd', inventory: { apple: 5, orange: 10 } }, { name: 'dm', inventory: { banana: 5, orange: 10 } } ]
  let correctResultSeven = [ { owd: { apple: 5, orange: 5 } }, { dm: { banana: 5 } }]

  let orderEight = { apple: 15, banana: 45, orange: 55, blueberries: 3, cantaloupe: 5 }
  let warehousesEight = [ { name: 'owd', inventory: { apple: 25, orange: 10 } }, { name: 'dm', inventory: { banana: 95, orange: 100 } }, { name: 'ab', inventory: { cantaloupe: 15, blueberries: 30 } } ]
  let correctResultEight = [ { owd: { apple: 15, orange: 10 } }, { dm: { banana: 45, orange: 45 } }, { ab: { cantaloupe: 5, blueberries: 3 } }]

  let orderNine = { apple: 53, banana: 25, orange: 15, blueberries: 300, cantaloupe: 15 }
  let warehousesNine = [ { name: 'owd', inventory: { apple: 5, orange: 10 } }, { name: 'dm', inventory: { banana: 5, orange: 10 } }, { name: 'ab', inventory: { cantaloupe: 5, blueberries: 3 } } ]
  let correctResultNine = []

  let orderTen = { }
  let warehousesTen = [ { name: 'owd', inventory: { apple: 5, orange: 10 } }, { name: 'dm', inventory: { banana: 5, orange: 10 } } ]
  let correctResultTen = []

  console.log("Test 1: Order Can Be Shipped Using One Warehouse: " + validateCorrectResult(orderOne, warehousesOne, correctResultOne))
  console.log("Test 2: Order Can Be Shipped Using Multiple Warehouses: " + validateCorrectResult(orderTwo, warehousesTwo, correctResultTwo))
  console.log("Test 3: Order Cannot Be Shipped Because There Is Not Enough Inventory: " + validateCorrectResult(orderThree, warehousesThree, correctResultThree))
  console.log("Test 4: Order Cannot Be Shipped Because There Is Not Enough Inventory: " + validateCorrectResult(orderFour, warehousesFour, correctResultFour))
  console.log("Test 5: Order Can Be Shipped Using Multiple Warehouses: " + validateCorrectResult(orderFive, warehousesFive, correctResultFive))
  console.log("Test 6: Order Can Be Shipped Using Multiple Warehouses: " + validateCorrectResult(orderSix, warehousesSix, correctResultSix))
  console.log("Test 7: Order Can Be Shipped Using Multiple Warehouses: " + validateCorrectResult(orderSeven, warehousesSeven, correctResultSeven))
  console.log("Test 8: Order Can Be Shipped Using Multiple Warehouses: " + validateCorrectResult(orderEight, warehousesEight, correctResultEight))
  console.log("Test 9: Order Cannot Be Shipped Because There Is Not Enough Inventory: " + validateCorrectResult(orderNine, warehousesNine, correctResultNine))
  console.log("Test 10: Empty Order: " + validateCorrectResult(orderTen, warehousesTen, correctResultTen))
}

runTests()