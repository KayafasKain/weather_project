//These function stands for date format validation
module.exports.ValidateDate = function( date ) {
	let validated_date = new Date( date );
	
	if( validated_date == "Invalid Date" ){
		throw { name: 'invalid_date' };
	}else{
		return date;
	}
}