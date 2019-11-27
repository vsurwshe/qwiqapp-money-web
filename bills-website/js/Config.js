// These const variables can be changed according to the Environment
const signupUrl = 'http://demoui-bills.124apps.com/signup'; 
const loginUrl = "http://demoui-bills.124apps.com/login";

// This is dynamic product list of bills reminder
const products=[
    {type:"Free",icon:"£",price:"0.0",payOptions:"per month",features:["You can create one profile with minimum features", "You can create limited no of categories and labels", "Limited Bills and Contacts"]},
    {type:"Basic",icon:"£",price:"0.99",payOptions:"per month",features:["Multiple profiles with Extra features","Multi-Currency feature for bills", "You can create Bills with Recurring Configuration"]},
    {type:"Premium",icon:"£",price:"3.99",payOptions:"per month",features:["Multiple profiles with premium features", "You can have attachments for Contacts, Bills and recurring feature for Bills" ]}
]


const whyBillsReminder = [
    {index: 1, header: "Cloud Sync", content: "Cloud syncing is a feature that keeps bills up to date through the cloud. The data can be accessed anywhere on whatever device you are using. When a user updates a bill, the changes are automatically synchronized with the corresponding profiles on user devices. You don't need to worry about back up of your info or syncing across devices. Sync is automatic with your App Account."},
    {index: 2, header: "Manages Payable and Receivable", content: "Tracks all your bills and classify into upcoming, overdue, paid and unpaid bills. You can easily check on your payments and receivables from the Dashboard. Make full or partial payments and delete payments quick and easy."},
    {index: 3, header: "Recurring Bills", content: "Specify recurring period, if it's a repeating bill. That's it, this app will take care and reminds you until you pay it. Plus it auto generates recurring bills in advance, so you never have to re-enter the bill again."},
    {index: 4, header: "Smart Bills Reminder", content: "Tracks all your bills and classify into upcoming, overdue, paid and unpaid bills. Sends a push notification to remind your bills."},
    {index: 5, header: "Reports / Charts", content: "Reports and charts provide the pictorial representation of your expenses making it easy to analyse your budget. With this feature, we can generate period wise comparison reports, Category wise Daily, Weekly, Monthly, and Yearly reports, Bills trend charts and also PDF reports."}
]

// This function is called at the time of loading index page
function load(){
    // This Lines are Geting Elements by id form html page
    var iconButtonElement=document.getElementById("iconUrl");
    var signupElement=document.getElementById("linkToSignup");
    var signupButtonElement=document.getElementById("signupButton");
    var loginElement = document.getElementById("linkToLogin");

    // This Lines are changing href tags dynamically in according to elements
    iconButtonElement.setAttribute('href',signupUrl);
    signupElement.setAttribute('href',signupUrl);
    signupButtonElement.setAttribute('href',signupUrl);
    loginElement.setAttribute('href', loginUrl);
    
    // This block shows features card dynamically  
    var features='';
    for(var i = 0, length = products.length; i < length; i++) {
        features = features+"<div class='plan col-12 mx-2 my-2 justify-content-center col-lg-4'> <div class='plan-header text-center pt-5'> <h3 class='plan-title mbr-fonts-style display-5'>"
            + products[i].type + "</h3><div class='plan-price'> <span class='price-value mbr-fonts-style display-5'>"
            + products[i].icon + "</span><span class='price-figure mbr-fonts-style display-1'><span style='font-weight: normal;'>"
            + products[i].price + "</span></span> <small class='price-term mbr-fonts-style display-7'>"
            + products[i].payOptions + "</small></div></div><div class='plan-body pb-5'><div class='plan-list align-center'><ul class='list-group list-group-flush mbr-fonts-style display-7'><br><ul>";
        // This block prints nested features line by line
        products[i].features.forEach((element)=>{ 
           return features = features+"<li>"+element+"</li>";
        })
        features = features+"</ul></ul></div></div></div>";
    }

    // This line appends above 'features' string to 'featuresSection' in index.html 
    $('#featuresSection').append(features);



    // This block shows 'Why Choose Bills Reminder?' content dynamically
    let content = '';
    whyBillsReminder.forEach(billsReminder=>{
        content = content+ "<div class='card separline pb-4'><div class='step-element d-flex'><div class='step-wrapper pr-3'><h3 class='step d-flex align-items-center justify-content-center'>"
            + billsReminder.index + "</h3></div><div class='step-text-content'><h4 class='mbr-step-title pb-3 mbr-fonts-style display-5'>"
            + billsReminder.header + "</h4><p class='mbr-step-text mbr-fonts-style display-7'>"
            + billsReminder.content + "<br></p></div></div></div>";
    })

    // This line appends above 'content' string to 'whyBillsReminder' section  in index.html 
    $('#whyBillsReminder').append(content);
}