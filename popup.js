let profileData = {
  email: '',
  category: '',
  purpose: '',
  currentCompany: ''
};

document.getElementById('emailInput').addEventListener('input', (event) => {
  profileData.email = event.target.value;
  updateOutput();
});

document.getElementById('companyInput').addEventListener('input', (event) => {
  profileData.currentCompany = event.target.value;
  updateOutput();
});

document.getElementById('categoryDropdown').addEventListener('change', (event) => {
  profileData.category = event.target.value;
  updateOutput();
});

document.getElementById('purposeDropdown').addEventListener('change', (event) => {
  profileData.purpose = event.target.value;
  console.log('Purpose updated:', profileData.purpose); // Debugging log
  updateOutput();
});

document.getElementById('extractButton').addEventListener('click', () => {
  document.getElementById('extractButton').style.display = 'none';

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: extractLinkedInData
    }, results => {
      if (results && results[0] && results[0].result) {
        Object.assign(profileData, results[0].result);
        document.getElementById('companyInput').value = profileData.currentCompany; // Update company input with extracted data
        updateOutput();
      } else {
        profileData.error = 'No data extracted';
        updateOutput();
      }
    });
  });

  document.getElementById('copyButton').style.display = 'flex';
});

document.getElementById('copyButton').addEventListener('click', () => {
  const outputText = document.getElementById('output').textContent;
  if (outputText) {
    copyToClipboard(outputText);
  } else {
    alert('No profile data available to copy!');
  }
});

document.getElementById('saveButton').addEventListener('click', () => {
  saveProfileData(profileData);
});

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
  return profileData;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function updateOutput() {
  const output = document.getElementById('output');
  console.log('Updating output:', profileData); // Debugging log
  output.textContent = JSON.stringify(profileData, null, 2);
}

function saveProfileData(data) {
  fetch('http://localhost:5000/api/v1/extension/saveProfile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
  })
  .catch((error) => {
    alert('Failed to save profile data.');
  });
  console.log(JSON.stringify(data));
}
