(function(w) {
  var config = {"metricsLabels":{"contentBoards":"TR Content Board","personalizations":"TR Personalization","audiences":"TR Audience","campaigns":"TR Campaign"},"hitTypes":{"contentBoards":"event","audiences":"event","personalizations":"event","campaigns":"event"},"shouldTrackOrgAssets":true,"firmTrackProvider":"aa","triblioVisitorId":"1emDmvjeFOcqi8IUMXPRSY5p"};
  var triblioVisitorId = config.triblioVisitorId;
  var firmographicRecord =  {"name":"(Non-Company Visitor)","sicCode":"N/A","isIsp":true,"employees":"N/A","revenue":"N/A","city":"N/A","region":"N/A","country":"N/A","domain":"N/A","naicCode":"N/A","employeesCode":"N/A","revenueCode":"N/A","industry":"N/A","subIndustry":"N/A"};
  var shouldTrackOrgAssets = config.shouldTrackOrgAssets;
  var eIdsToNames = {"personalizations":{},"campaigns":{},"contentHubs":{},"audiences":{"7911":"Anyone","ZWY0":"Test - Digital Battlespace","G0qk":"CRM Accounts","jpx9":"Government Federal","v7GB":"eloqua","a2p6":"Defense Master List","pX3X":"Army","bZXZ":"Health","XaoX":"All CRM Accounts","WJPY":"CRM Upload of Domain","R1GQ":"Lift Test for Helpful Domains","R487":"Example Audience","G0M8":"All Surging Accounts","RGAJ":"Test","MY6p":"Integration Test","6AW5":"Account - NMC","o77b":"Claire's Test - Advanced","mgg7":"Claire's Test - Visitor Behavior","XXvj":"Claire's Test - Account List","npjg":"Account List"}};
  var thirdPartyLibraryLoaded = false;
  var maxRetries = 1000;
  var retryCount = 0;

  if(sessionStorage && sessionStorage.setItem){
    sessionStorage.setItem("s_triblio_visitor_id", triblioVisitorId);
  }

  if(!w.Triblio){ w.Triblio = {}; }
  if(w.Triblio.onAccountIdReady){ w.Triblio.onAccountIdReady(firmographicRecord); }
  w.Triblio.getAccountId = function(){
    return firmographicRecord;
  };

  if(!w.TriblioAssetNameTracking) w.TriblioAssetNameTracking = {queued: []};

  function AdobeTracker(){}

  AdobeTracker.prototype.run = function(){
    this.postFirmographicData();
    this.checkAssetNamesQueue();
  };

  AdobeTracker.prototype.postFirmographicData = function(){
    var data = {"name":"(Non-Company Visitor)","sicCode":"N/A","isIsp":true,"employees":"N/A","revenue":"N/A","city":"N/A","region":"N/A","country":"N/A","domain":"N/A","naicCode":"N/A","employeesCode":"N/A","revenueCode":"N/A","industry":"N/A","subIndustry":"N/A"};
var _check = function(){
  if(typeof s !== "undefined"){ //s is found
    s.eVar48 =  data.name;
    s.eVar49 =  data.domain;
    s.eVar50 =  data.industry;
    s.eVar51 =  data.subIndustry;
    s.eVar52 =  data.employees;
    s.eVar53 =  data.revenue;
  }
  else {
    setTimeout(_check, 5000); 
  }
};

 sessionStorage.setItem("tr_eVar48", data.name);
 sessionStorage.setItem("tr_eVar49", data.domain);
 sessionStorage.setItem("tr_eVar50", data.industry);
 sessionStorage.setItem("tr_eVar51", data.subIndustry);
 sessionStorage.setItem("tr_eVar52", data.employees);
 sessionStorage.setItem("tr_eVar53", data.revenue);

 _check();
  };

  AdobeTracker.prototype.checkAssetNamesQueue = function(){
    var that = this;

    if(w.TriblioAssetNameTracking.queued){
      w.TriblioAssetNameTracking.queued.forEach(function(ids){
        that.postAssetNames(ids);
      });
    }
  };

  AdobeTracker.prototype.postAssetNames = function(ids){
    _waitForThirdParty(function(){
      if(shouldTrackOrgAssets && thirdPartyLibraryLoaded){
        var data = _getAssetNamesFromIds(ids);

        data.forEach(function(d){
      window[gaObjectAlias]("send",{
        "hitType": d.hitType,
        "eventCategory": d.metricsLabel,
        "eventLabel": d.name,
        "nonInteraction": true
      });
    });
  
      }
    });
  };

  function _waitForThirdParty(callback){
    if(thirdPartyLibraryLoaded){
      callback();
    }
    else if((typeof s_gi === "undefined" || typeof s === "undefined") && retryCount <= maxRetries){
      /*wait for aa to load*/
      setTimeout(function(){
        retryCount++;
        _waitForThirdParty(callback);
      }, 5);
    }
    else if(retryCount > maxRetries){
      console.log("cant find adobe analytics library on page!");
    }
    else{
      thirdPartyLibraryLoaded = true;
      callback();
    }
  }

  function _getAssetNamesFromIds(data){
    var lookup = eIdsToNames;
    if(!lookup || !Object.keys(lookup).length){
      lookup = {personalizations:{}, contentHubs: {}, audiences:{}, campaigns:{}};
    }
    var names = [];

    if(data.type !== "board" && data.personalizationId && data.audienceSegmentId && data.campaignId){
      var personalizationIds = data.personalizationId.split(",");
      var audienceSegmentIds = data.audienceSegmentId.split(",");
      var campaignIds = data.campaignId.split(",");

      personalizationIds.forEach(function(pId, index){
        var hasPersonalization = (personalizationIds[index] && lookup.personalizations[personalizationIds[index]]) ? true : false;
        var hasAudience = (audienceSegmentIds[index] && lookup.audiences[audienceSegmentIds[index]]) ? true : false;
        var hasCampaign = (campaignIds[index] && lookup.campaigns[campaignIds[index]]) ? true : false;

        names.push({
          campaign: lookup.campaigns[campaignIds[index]],
          audience: lookup.audiences[audienceSegmentIds[index]],
          personalization: lookup.personalizations[personalizationIds[index]],
          action: data.action //impression or click
        });
      });
    }
    return names;
  }

  var tracker = new AdobeTracker();
  w.TriblioAssetNameTracking.postAssetNames = tracker.postAssetNames;

  tracker.run();
}(window));