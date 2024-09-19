let allFeatures = []; // Store all data here

// Function to load data from the API
const loadData = async () => {
  try {
    const res = await fetch('https://openapi.programming-hero.com/api/ai/tools');
    const data = await res.json();
    allFeatures = data.data.tools; // Fetch and store all tools
    displayData(allFeatures.slice(0, 6)); // Display only first 6 items initially
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Function to display data in the container
const displayData = (features) => {
  const phoneContainer = document.getElementById('phone-container');
  phoneContainer.innerHTML = ''; // Clear the container

  features.forEach(feature => {
    const phoneCard = document.createElement('div');
    phoneCard.classList = 'card card-compact p-4 shadow-xl  bg-blue-400';

    // Set inner HTML for the card
    phoneCard.innerHTML = `
      <figure>
        <img src="${feature.image}" alt="${feature.name}" />
      </figure>
      <div class="card-body bg-slate-800 text-white">
        <h2 class="card-title">${feature.name}</h2>
        <p>${feature.description || 'No description available.'}</p>
        <div class="card-actions justify-end">
          <button onclick="handleShowDetails('${feature.id}');" class="btn btn-primary">Show details</button>
        </div>
      </div>
    `;

    // Append the card to the container
    phoneContainer.appendChild(phoneCard);
  });

  // Display "Show All" button only if there are more than 6 items
  const showAllButton = document.getElementById('show-all-btn');
  if (features.length === 6 && allFeatures.length > 6) {
    showAllButton.classList.remove('hidden');
  } else {
    showAllButton.classList.add('hidden'); // Hide button if all data is shown
  }
};

// Function to display all data
const showAllData = () => {
  displayData(allFeatures); // Display all the data when button is clicked
};

// Function to handle showing details in the modal
const handleShowDetails = async (id) => {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`);
    const data = await res.json();
    const tool = data.data;
    console.log(tool);

    // Populate modal with data
    document.getElementById('modal-image').src = tool.image_link[0] || ''; // Use fallback if no image
    document.getElementById('modal-title').innerText = tool.tool_name || 'No title available';
    document.getElementById('modal-description').innerText = tool.description || 'No description available';
   ;
   document.getElementById('input-ex').innerText=tool.input_output_examples[0].output;
   document.getElementById('output-ex').innerText=tool.input_output_examples[1].output;


    // Generate the feature list
    const featureList = tool.features 
      ? Object.keys(tool.features).map((key, index) => `<li>${index + 1}. ${tool.features[key].feature_name || 'No feature name'}</li>`).join('') 
      : 'No features available';
    document.getElementById('modal-features').innerHTML = featureList;

    // Populate other tool data if available
    document.getElementById('modal-additional-data').innerHTML = `
      <h3>Additional Information:</h3>
      <p><strong>Pricing:</strong> ${tool.pricing ? tool.pricing[0].price : 'Not available'}</p>
      <p><strong>Country:</strong> ${tool.country || 'Not available'}</p>
    `;

    // Show the modal
    document.getElementById('details-modal').showModal();
  } catch (error) {
    console.error('Error fetching tool details:', error);
  }
};

// Function to close the modal
const closeModal = () => {
  document.getElementById('details-modal').close();
};

// Call the function to load data initially
loadData();
