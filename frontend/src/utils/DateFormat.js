Date.prototype.toShortFormat = function() {

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
                        "May", "Jun", "Jul", "Aug",
                        "Sep", "Oct", "Nov", "Dec"];
    
    const day = this.getDate();
    
    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];
    
    const year = this.getFullYear();
    
    return `${day} ${monthName} ${year}`;  
}

Date.prototype.toLongFormat = function() {

    const monthNames = ["January", "February", "March", "April",
                        "May", "June", "July", "August",
                        "September", "October", "November", "December"];
    
    const day = this.getDate();
    
    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];
    
    const year = this.getFullYear();
    
    return `${day} ${monthName} ${year}`;  
}

Date.prototype.toTimeFormat = function() {

    const hours = this.getHours();
    const minutes = this.getMinutes();
    
    return `${hours}:${minutes}`;  
}

Date.prototype.toDateTimeFormat = function() {
    return `${this.toShortFormat()} ${this.toTimeFormat()}`;
}