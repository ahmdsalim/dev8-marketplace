<?php

namespace App\Providers;

use App\Repositories\CartRepository;
use App\Repositories\UserRepository;
use App\Repositories\OrderRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\ProductRepository;
use Illuminate\Support\ServiceProvider;
use App\Repositories\CategoryRepository;
use App\Interfaces\CartRepositoryInterface;
use App\Interfaces\UserRepositoryInterface;
use App\Interfaces\OrderRepositoryInterface;
use App\Interfaces\PaymentRepositoryInterface;
use App\Interfaces\ProductRepositoryInterface;
use App\Interfaces\CategoryRepositoryInterface;
use App\Interfaces\CollaborationInterface;
use App\Repositories\CollaborationRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(CartRepositoryInterface::class, CartRepository::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
        $this->app->bind(CollaborationInterface::class, CollaborationRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
