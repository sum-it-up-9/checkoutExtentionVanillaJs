checkoutKitLoader.load('extension').then(async function(module) {
  console.log("Checkout loader - extension")
  const params = new URL(document.location).searchParams;
  const extensionId = params.get('extensionId');


  console.log('params',params);
  

  const orderId = params.get('orderId');
  const cartId = params.get('cartId');
  const parentOrigin = params.get('parentOrigin');

  console.log('orderId: ',orderId);
  console.log('cartId: ',cartId);
  console.log('parentOrigin: ',parentOrigin);
  console.log('extensionId: ',extensionId);

  const extensionService = await module.initializeExtensionService({
    extensionId,
    parentOrigin,
    taggedElementId: 'content',
  });

  

});