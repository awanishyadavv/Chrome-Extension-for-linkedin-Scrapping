function extractLinkedInData() {
  const profileData = {};

  const nameElement = document.querySelector('h1.text-heading-xlarge');
  profileData.name = nameElement ? nameElement.innerText.trim() : '';

  const titleElement = document.querySelector('.text-body-medium');
  profileData.title = titleElement ? titleElement.innerText.trim() : '';

  const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
  profileData.location = locationElement ? locationElement.innerText.trim() : '';

  const companyElement = document.querySelector('.pv-text-details__right-panel button span');
  profileData.currentCompany = companyElement ? companyElement.innerText.trim() : '';

  const profileLinkElement = document.querySelector('a[href^="/in/"]');
  profileData.profileLink = profileLinkElement ? profileLinkElement.href.trim() : '';

  const experienceElements = document.querySelectorAll('#experience .artdeco-list__item');
  profileData.experience = Array.from(experienceElements).map(element => {
    const positionElement = element.querySelector('.t-bold span');
    const companyElement = element.querySelector('.t-14.t-normal span');
    return {
      position: positionElement ? positionElement.innerText.trim() : '',
      company: companyElement ? companyElement.innerText.trim() : ''
    };
  });
  
  return jsonData;
}
