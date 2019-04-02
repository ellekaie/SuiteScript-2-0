require(['N/crypto', 'N/encode'],
function (crypto, encode)
{
	var enterpriseId = 'TSTDRV123';
	var time         = new Date().getTime(); // number
	var strTime      = time.toString();
	var inputString  = enterpriseId + strTime;
	
	log.debug(inputString);
	
    var hmacSHA512 = crypto.createHash({
		algorithm : crypto.HashAlg.SHA512
	});
	
	var hashUpdated = hmacSHA512.update({
		input : inputString
	});
	
    var digestSHA512 = hmacSHA512.digest({
        outputEncoding: encode.Encoding.HEX
    });
    
	log.debug(digestSHA512);
});
