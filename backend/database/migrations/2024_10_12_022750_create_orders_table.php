<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status');
            $table->integer('subtotal')->nullable();
            $table->integer('total_amount')->nullable();
            $table->text('delivery_address');
            $table->string('courier');
            $table->string('courier_service');
            $table->string('resi_number')->nullable();
            $table->integer('delivery_cost')->nullable();
            $table->string('snap_token')->nullable();
            $table->text('payment_url')->nullable(); //Column for development purpose only
            $table->timestamp('order_date')->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
