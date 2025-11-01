using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MakeCreatedByUserNonNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the old foreign key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_Conversations_Users_CreatedByUserId",
                schema: "chat",
                table: "Conversations");

            // Make CreatedByUserId non-nullable
            migrationBuilder.AlterColumn<Guid>(
                name: "CreatedByUserId",
                schema: "chat",
                table: "Conversations",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            // Add the new foreign key constraint with Restrict behavior
            migrationBuilder.AddForeignKey(
                name: "FK_Conversations_Users_CreatedByUserId",
                schema: "chat",
                table: "Conversations",
                column: "CreatedByUserId",
                principalSchema: "chat",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
