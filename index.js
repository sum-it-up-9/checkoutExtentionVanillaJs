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


  

});