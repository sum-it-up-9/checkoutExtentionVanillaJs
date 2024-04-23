checkoutKitLoader.load('extension').then(async function(module) {
  console.log("Checkout loader - extension")
  const params = new URL(document.location).searchParams;
  const extensionId = params.get('extensionId');
  const cartId = params.get('cartId');
  const parentOrigin = params.get('parentOrigin');
  const extensionService = await module.initializeExtensionService({
    extensionId,
    parentOrigin,
    taggedElementId: 'content',
  });


  // reload checkout
  const reloadButton = document.getElementById('reload-checkout');
  reloadButton.addEventListener(
    'click',
    function() {
      console.log('reload checkout');
      extensionService.post({ type: ExtensionCommandType.ReloadCheckout });
    }
  );

  //manually trigger pricing update
  const submitShippingOption = document.getElementById('submit-shipping-option');
  submitShippingOption.addEventListener(
    'click',
    function() {
      consignmentUpdateTriggered(extensionService, cartId);
    }
  );



  extensionService.addListener('EXTENSION:CONSIGNMENTS_CHANGED', async (data) => {

    const priceUpdateNeeded = compareConsignments(data?.payload?.consignments, data?.payload?.previousConsignments);
    if (priceUpdateNeeded) {
      console.log("Consignment updated, need to trigger price update.")
      consignmentUpdateTriggered(extensionService, cartId, data);
    } else {
      console.log("Key Consignment fields(country, state, shipping option) not updated, no need to trigger price update.")
    }

  });

  async function consignmentUpdateTriggered(extensionService, cartId, data) {
    console.log('consignments changed', data);
    //compareConsignments(data.payload.consignments, data.payload.previousConsignments);

    showLoadingIndicator(extensionService);
    //post message to parent window - hide continue button
    window.top.postMessage("hide-checkout-shipping-continue", "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com");


    //perform price update operations

    try {

      await requestCartPriceUpdate(cartId);
    } catch (e) {
      console.log("Error in requestCartPriceUpdate");
    }

    //sleep for 3 seconds
    await sleep(1000);
    //post message to parent window - show continue button
    hideLoadingIndicator();
    window.top.postMessage("show-checkout-shipping-continue", "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com");
    //window.top.postMessage("checkout-shipping-next-step", "https://sellars-absorbent-materials-sandbox-1.mybigcommerce.com");
  }

  async function requestCartPriceUpdate(cartId) {
    //make fetch call to  http://localhost:7071/api/updateProductPrices with cartID as a post json
    //test with California and Florida
    const cartUpdate = await fetch('http://localhost:7071/api/updateProductPrices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checkoutId: cartId,
        fedex:{
          accountNumber:"CUST-101"
        }
      })
    }).then(response => {
      console.log(response);
      return response.json();
    });

    console.log(cartUpdate);

  }

  function compareConsignments(consignments, previousConsignments) {
    let changed = false;
    consignments.forEach((consignment) => {
      const { id, shippingAddress: { country, stateOrProvinceCode } } = consignment;
      const shippingOptionId = consignment?.selectedShippingOption?.id;

      if (previousConsignments.length === 0) {
        changed = true;
      } else {
        const prevConsignment = previousConsignments.find(prev => prev.id === id);
        const previousCountry = prevConsignment.shippingAddress.country;
        const previousStateOrProvinceCode = prevConsignment.shippingAddress.stateOrProvinceCode;
        const previousShippingOptionId = prevConsignment?.selectedShippingOption?.id;

        if (country !== previousCountry) {
          console.log(`️🔄 Consignment #${id} shipping country change: ${previousCountry} -> ${country}.`);
          changed = true;
        }
        if (stateOrProvinceCode !== previousStateOrProvinceCode) {
          console.log(`️🔄 Consignment #${id} shipping state change: ${previousStateOrProvinceCode} -> ${stateOrProvinceCode}.`);
          changed = true;
        }
        if (shippingOptionId !== previousShippingOptionId) {
          console.log(`️🔄 Consignment #${id} shipping option change: ${previousShippingOptionId} -> ${shippingOptionId}.`);
          changed = true;
        }
      }
    });
    return changed;
  }


  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function showLoadingIndicator() {
    extensionService.post({
      type: ExtensionCommandType.ShowLoadingIndicator,
      payload: { show: true },
    });

  }

  function hideLoadingIndicator() {
    extensionService.post({
      type: ExtensionCommandType.ShowLoadingIndicator,
      payload: { show: false },
    });
  }

});