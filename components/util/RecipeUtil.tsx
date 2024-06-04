import apiClient from "./ApiClient";
export const deleteRecipe = async (recipeId: string) => {
    try {
        console.log('Attempting to delete recipe with ID:', recipeId);
        const response = await apiClient.delete(`/recipe/delete/${recipeId}`);
        console.log('Recipe deleted successfully, server responded with:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting recipe:', error);
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
        throw error;
    }
};

export const fetchRecipeDetails = async (recipeId: string) => {
    try {
        console.log('Fetching recipe details for ID:', recipeId);
        const detailsResponse = await apiClient.get(`/recipe/read/${recipeId}`);
        return detailsResponse.data;
    } catch (error: any) {
        console.error('Error fetching recipe details:', error);
        throw error;
    }
};

export const generateRecipe = async (ingredients: string[], instructions: string, mode: string, userId: string) => {
    const data = {
        ingredients,
        instructions,
        userId,
        mode
    };


    try {
        console.log('Attempting to post data...');
        const response = await apiClient.post('/recipe/generateRecipe', data);

        const { recipeID } = response.data;
        console.log('Generated recipe ID:', recipeID);

        const recipe = await fetchRecipeDetails(recipeID);
        return recipe;

    } catch (error: any) {
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
        throw error;
    }
};
