<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class RajaOngkirController extends Controller
{
    /**
     * API_KEY
     *
     * @var string
     */
    protected $API_KEY;
    protected $ORIGIN_CITY;

    public function __construct()
    {
        $this->API_KEY = env('API_KEY_RAJAONGKIR');
        $this->ORIGIN_CITY = env('ORIGIN_CITY');
    }

    /**
     * Get all provinces
     * @return void
     */
    public function getProvinces()
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->API_KEY,
            ])->get('https://api.rajaongkir.com/starter/province');
            
            $provinces = $response['rajaongkir']['results'];
    
            return ApiResponseClass::sendResponse($provinces, 'Provinces fetched successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e,'Provinces not fetched');
        }
        
    }

    /**
     * Get all cities
     * @return void
     */
    public function getCities($id)
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->API_KEY,
            ])->get("https://api.rajaongkir.com/starter/city?province=$id");
    
            $cities = $response['rajaongkir']['results'];
    
            return ApiResponseClass::sendResponse($cities, 'Cities fetched successfully', 200);
        } catch (\Exception $e) {
            return ApiResponseClass::throw($e, 'Cities not fetched');
        }
    }

    /**
     * Get delivery cost
     * @param Request $request
     * @return void
     */
    public function getDeliveryCost(Request $request)
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->API_KEY
            ])->post('https://api.rajaongkir.com/starter/cost', [
                'origin'            => $this->ORIGIN_CITY,
                'destination'       => $request->destination,
                'weight'            => $request->weight,
                'courier'           => $request->courier
            ]);

            \Log::info('Delivery cost API Response:', [
                'status'  => $response->status(),
                'headers' => $response->headers(),
                'body'    => $response->json()
            ]);
    
            $costs = $response['rajaongkir']['results'][0]['costs'];
    
            return ApiResponseClass::sendResponse($costs, 'Delivery cost fetched successfully', 200);
        } catch (\Exception $e) {
            // throw::($e, $e->getMessage());

            return ApiResponseClass::throw($e, $e-> getMessage());
        }
    }

}
